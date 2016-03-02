var async = require('async');
var pomelo = require('pomelo');


var Team = require('../domain/entity/Team');
var utilFunc = require('../util/utilFunc');
var consts = require('../config/consts');
var ServerStatus = require('../config/consts').ServerStatus;
var GameDao = require('../dao/game/gameDao');
var userDao = require('../dao/user/userDao');

var server_resp_hash = require('../config/server_resp_hash').data;

var handler = module.exports;

// global team container(teamId:teamObj)
var gTeamObjDict = {};
// global team id
var gTeamId = 0;

var ACTIVE_USER_TIME = 100;

/* *
* @param: data {} 
* @api public
* */
handler.applyJoinTeam = function(data, callfunc) {
	var _teamObject = null, _userBalance = 0;
	var _rtnData = {teamId: 0, member: []};

	async.series({
		checkParam: function(callback) {
			if (data.teamType !=  consts.TeamType.Gold && data.teamType != consts.TeamType.Diamond) return callback('error team type');

			return callback(null);
		},
		checkFreeTeam: function(callback) {
			_teamObject = getHasPositionTeam(data.teamType);

			if (!_teamObject) _teamObject = new Team(++gTeamId, data.teamType);

			if (!_teamObject) return callback('find or create team error');

			return callback(null);
		},
		queryBalance: function(callback) {
			userDao.queryUserBalance({userId: data.userId, teamType: data.teamType}, function(error, doc) {
				if (error) return callback(error);

				_userBalance = doc;
				return callback(null);
			})
		},
		joinTeam: function(callback) {
			var _addStatus = _teamObject.addPlayer(data);
			if (!_addStatus) return callback('add player error');

			var _teamId = _teamObject.getTeamBasicInfo().teamId;

			if (!gTeamObjDict[_teamId]) gTeamObjDict[_teamId] = _teamObject;

			_rtnData.teamId = _teamId;
			_rtnData.member = _teamObject.getTeamMemberBasic();
			return callback(null);
		},
		pushMessage: function(callback) {
			_teamObject.pushJoinMsg2All({userId: data.userId, username: 'admin', balance: _userBalance, avata: 'temp'}, function(error, doc) {
				return callback(null);
			})
		}
	}, function(error, doc) {
		if (error) {
			return callfunc(error, doc);
		} else {
			return callfunc(error, _rtnData);
		}
	})
}

//准备开始

handler.applyPrepareGame = function(data, callfunc) {
	var _teamObject = null, _rtnData = [], _userWeight = 0;

	async.series({
		queryTeamObject: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			var _teamOnlineMemberList = _teamObject.getOnlineTeamMember();
			if (_teamOnlineMemberList.length < 2) return callback("less limit member");

			return callback(null);
		},
		checkTeamCondition: function(callback) {
			//检查玩家余额是否符合游戏要求
			userDao.queryUserBalance({userId: data.userId, teamType: data.teamType}, function(error, doc) {
				if (error) return callback(error);
				//todo: 
				if (doc < 100) return callback('insufficient balance');

				return callback(null);
			});
		},
		initUserCard: function(callback) {
			//todo: 计算该玩家的权重值，分配牌型
			var _weightScore = utilFunc.getUserWeightScore();
			_userWeight = utilFunc.getUserCardType(_weightScore);

			var _teamUserBasic = _teamObject.getTeamUserBasic({userId: data.userId});
			_teamUserBasic.userBasic.weight = _userWeight;
			_teamUserBasic.userBasic.state = consts.UserState.Ready;
			_teamUserBasic.userBasic.activeTime = Date.now()/1000|0;

			// var _teamMemberList = _teamObject.getTeamMemberList();
			// for (var i in _teamMemberList) {
			// 	if (_teamMemberList[i].userId == data.userId) {
			// 		_rtnData.push(data.userId);
			// 		_teamMemberList[i].userBasic.weight = _userWeight;
			// 		_teamMemberList[i].userBasic.state = consts.UserState.Ready;
			// 		_teamMemberList[i].userBasic.activeTime = Date.now()/1000|0;
			// 	}
			// 	//todo: 是否需要加入其他返回数据
			// 	_rtnData.push({userId: _teamMemberList[i].userId, state: _teamMemberList[i].userBasic.state}); 
			// }
			return callback(null);
		},
		checkConditon: function(callback) {
			//如果举手人数满足最小条件，那么准备开始游戏
			var _teamReadyNum = 0;
			var _teamMemberList = _teamObject.getTeamMemberList();
			for (var i in _teamMemberList) {
				if (_teamMemberList[i].userBasic.state == consts.UserState.Ready) ++_teamReadyNum;
			}

			if (_teamReadyNum >= 2) {
				var _teamBasicInfo = _teamObject.getTeamBasicInfo();
				_teamBasicInfo.state = consts.GameState.Wait;
				_teamBasicInfo.timestamp = Date.now()/1000|0;
			}

			return callback(null);
		},
		pushMessage: function(callback) {
			_teamObject.pushPrepareMsg2All({userId: data.userId}, function(){
				return callback(null);
			})
		}
	}, function(error, doc) {
		if (error) {
			return callfunc(error);
		} else {
			return callfunc(null, _rtnData);
		}
	})
}

/* *
* @function: 
* */
handler.applyStartGame = function(data, callfunc) {
	var _teamObject = null, _rtnData = [];
	async.series({
		queryTeamObject: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkConditon: function(callback) {
			//检查是否满足开始条件
			var _teamBasicInfo = _teamObject.getTeamBasicInfo();
			if (_teamBasicInfo.state != consts.GameState.Wait) return callback('game state error');
			if ((Date.now()/1000|0) - _teamBasicInfo.timestamp <= 5) return callback('game wait state, can not start game');

			return callback(null);
		},
		initCardBasic: function(callback) {
			var _teamMemberList = _teamObject.getProcessTeamMember();
			if (_teamMemberList.length < 2) return callback('team member less limit');

			for (var i in _teamMemberList) {
				if (_teamMemberList[i].userBasic.state != consts.UserState.Ready) continue;
				_teamMemberList[i].userCard = _teamObject.initUserCard(_teamMemberList[i].userBasic.weight);
			}

			return callback(null);
		},
		filterData: function(callback) {
			//筛选数据, 金额, 修改状态
			var _teamMemberList = _teamObject.getTeamMemberList();
			if (_teamMemberList.length < 2) return callback('team member less limit');

			for (var i in _teamMemberList) {
				_rtnData.push({userId: _teamMemberList[i].userId, gold: _teamMemberList[i].userBasic.gold, diamond: _teamMemberList[i].userBasic.diamond});
				_teamMemberList[i].userBasic.state = consts.UserState.Progress;
			}

			return callback(null);
		},
		pushMessage: function(callback) {
			_teamObject.pushStartMsg2All(_rtnData, function(){
				return callback(null);
			});
		}
	}, function(error, doc) {
		if (error) {
			return callfunc(error, doc);
		} else {
			return callfunc(error, _rtnData);
		}
	})
}

handler.applyBetGame = function(data, callfunc) {
	var _teamObject = null, _rtnData = [], _gameState = consts.GameState.None;

	async.series({
		queryTeamObject: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkTeamMember: function(callback) {
			var _teamBasicInfo = _teamObject.getTeamBasicInfo();
			if (!_teamBasicInfo) return callback('get team basic info error');
			if (!_teamBasicInfo.state != consts.GameState.Process) return callback('game state error');

			var _teamMemberList = _teamObject.getProcessTeamMember();
			if (_teamMemberList.length == 1) {
				doClearingGameEnd(_teamObject, data.userId, function(error, doc) {
					if (error) return callback(error);

					_rtnData = doc; _rtnData['gameState'] = consts.GameState.Clear;

					return callback(null);
				});
			} else if (_teamMemberList.length >= 2) {
				var _selfBasic = _teamObject.getTeamUserBasic(data.userId);
				if (!_selfBasic) return callback('can not find user information');

				var _userBetType = utilFunc.getUserBetType(_selfBasic.userCard.cardState, data.bet, _teamBasicInfo.betType);
				if (_userBetType == -1) return callback('error card state or bet');
		
				
				doDeductGameBet(_teamObject, data.userId, 1, function(error, doc) {
					if (error) return callback(error);
					_rtnData = doc; _rtnData['gameState'] = consts.GameState.Process;
					return callback(null);
				});
			} else {
				return callback('online player less limit');
			}
		}
	}, function(error, doc) {
		return callfunc(error, _rtnData);
	})
}

handler.applyCheckGame = function(data, callfunc) {
	var _teamObject = null;

	async.series({
		queryTeamObject: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkConditon: function(callback) {
			var _teamBasicInfo = _teamObject.getTeamBasicInfo();
			if (!_teamBasicInfo) return callback('get team basic info error');
			if (!_teamBasicInfo.state != consts.GameState.Process) return callback('game state error');

			var _teamMemberList = _teamObject.getProcessTeamMember();
			if (_teamMemberList.length == 1) {
				doClearingGameEnd(_teamObject, data.userId, function(error, doc) {
					if (error) return callback(error);

					//_rtnData = doc; _rtnData['gameState'] = consts.GameState.Clear;

					return callback(null);
				});
			} else if (_teamMemberList.length >= 2) {
				var _selfBasic = _teamObject.getTeamUserBasic(data.userId);
				_selfBasic.userCard.cardState = consts.CardState.Check;
				return callback(null);
			} else {
				return callback('online player less limit');
			}
		}
	}, function(error, doc) {
		if (error) {
			return callfunc(error, doc);
		} else {
			return callfunc(error, doc);
		}
	})
}

handler.applyAbandonGame = function(data, callfunc) {
	var _teamObject = null;

	async.series({
		queryTeamObject: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkConditon: function(callback) {
			var _teamBasicInfo = _teamObject.getTeamBasicInfo();
			if (!_teamBasicInfo) return callback('get team basic info error');
			if (!_teamBasicInfo.state != consts.GameState.Process) return callback('game state error');

			var _teamMemberList = _teamObject.getProcessTeamMember();
			if (_teamMemberList.length == 1) {
				//结算
				doClearingGameEnd(_teamObject, data.userId, function(error, doc) {
					if (error) return callback(error);

					//_rtnData = doc; _rtnData['gameState'] = consts.GameState.Clear;

					return callback(null);
				});
			} else if (_teamMemberList.length == 2) {
				//修改状态，结算
				var _selfBasic = _teamObject.getTeamUserBasic(data.userId);
				_selfBasic.userCard.cardState = consts.CardState.Abandon;

				doClearingGameEnd(_teamObject, data.userId, function(error, doc) {
					if (error) return callback(error);

					//_rtnData = doc; _rtnData['gameState'] = consts.GameState.Clear;

					return callback(null);
				});
			} else if (_teamMemberList.length >= 3) {
				//更新状态
				var _selfBasic = _teamObject.getTeamUserBasic(data.userId);
				_selfBasic.userCard.cardState = consts.CardState.Abandon;

				_teamObject.pushAbandonMsg2All({}, function(error, doc) {
					return callback(null);
				})
			} else {
				return callback('online player less limit');
			}
		}
	}, function(error, doc) {
		if (error) {
			return callfunc(error, doc);
		} else {
			return callfunc(error, doc);
		}
	})
}

handler.applyLeaveGame = function(data, callfunc) {
	var _teamObject = null;

	async.series({
		queryTeamObject: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkConditon: function(callback) {
			var _teamBasicInfo = _teamObject.getTeamBasicInfo();
			if (!_teamBasicInfo) return callback(null);
			if (!_teamBasicInfo.state != consts.GameState.Process) return callback(null);

			var _teamMemberList = _teamObject.getProcessTeamMember();
			if (_teamMemberList.length == 1) {
				delete gTeamObjDict[data.teamId];
				return callback(null);
			} else if (_teamMemberList.length == 2) {
				//更新状态、结算
				var _selfBasic = _teamObject.getTeamUserBasic(data.userId);
				_selfBasic.userCard.cardState = consts.CardState.Abandon;

				doClearingGameEnd(_teamObject, data.userId, function(error, doc) {
					if (error) return callback(error);

					//_rtnData = doc; _rtnData['gameState'] = consts.GameState.Clear;

					return callback(null);
				});
			} else if (_teamMemberList.length >= 3) {
				var _selfBasic = _teamObject.getTeamUserBasic(data.userId);
				_selfBasic.userCard.cardState = consts.CardState.Abandon;

				_teamObject.pushLeaveMsg2All({}, function(error, doc) {
					return callback(null);
				})				
			} else {
				return callback('online player less limit');
			}
		}
	}, function(error, doc) {

	})
}

handler.applyCompareGame = function(data, callfunc) {
	var _teamObject = null, _rtnData = {};

	async.series({
		queryTeamObject: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkConditon: function(callback) {
			var _teamMemberList = _teamObject.getProcessTeamMember();
			if (_teamMemberList.length == 1) {
				doClearingGameEnd(_teamObject, data.userId, function(error, doc) {
					if (error) return callback(error);

					//_rtnData = doc; _rtnData['gameState'] = consts.GameState.Clear;

					return callback(null);
				});
			} else if (_teamMemberList.length >= 2) {
				var _compareResult = _teamObject.getCompareUserCard({userId: data.userId}, {userId: data.awayId});
				if (_compareResult == null) return callback('error data');

				if (_compareResult == true) {
					_rtnData = {userId: data.userId, awayId: data.awayId, winner: data.userId};
					var _teamUserBasic = _teamObject.getTeamUserBasic({userId: data.userId});
					if (!_teamUserBasic) return callback('error not find user basic info');

					_teamUserBasic.userBasic.state = consts.CardState.Abandon;
				} else {
					_rtnData = {userId: data.userId, awayId: data.awayId, winner: data.awayId};
					var _teamUserBasic = _teamObject.getTeamUserBasic({userId: data.awayId});
					if (!_teamUserBasic) return callback('error not find user basic info');

					_teamUserBasic.userBasic.state = consts.CardState.Abandon;
				}

				_teamObject.pushCompareMsg2All({}, function(error, doc) {
					return callback(null);
				})
			} else {
				return callback('online player less limit');
			}
		}
	}, function(error, doc) {
		if (error) {
			return callfunc(error, doc);
		} else {
			return callfunc(error, {});
		}
	})
}

handler.applyClearGame = function(data, callfunc) {
	return callfunc(null);
}

handler.applyChangeGame = function(data, callfunc) {
	var _currentTeamId = data.teamId;
	async.series({
		exitCurrentTeam: function(callback) {
			return callback(null);
		},
		addToTeam: function(callback) {
			return callback(null);
		},
		initUserCard: function(callback) {
			return callback(null);
		}
	}, function(error, doc) {
		return func(null);
	})
}

// handler.applyRaiseGame = function(data, callfunc) {
// 	var _teamObject = null;

// 	async.series({
// 		checkTeamObject: function(callback) {
// 			_teamObject = gTeamObjDict[data.teamId];
// 			if (!_teamObject) return callback('error team id');

// 			return callback(null);
// 		},
// 		checkUserBet: function(callback) {
// 			var _teamMemberList = _teamObject.getProcessTeamMember();

// 			if (_teamMemberList.length == 1) {
// 				doClearingGameEnd(_teamObject, data.userId, function(error, doc) {
// 					if (error) return callback(error);
// 					_rtnData = doc; _rtnData['gameState'] = consts.GameState.Clear;
// 					return callback(null);
// 				});
// 			} else if (_teamMemberList.length >= 2) {

// 			} else {
// 				return callback('online player less limit');
// 			}
// 		}
// 	}, function(error, doc) {

// 	})
// }



function getTeamObjectById (teamId) {
	return null;
}

function getHasPositionTeam(teamType) {
	for (var i in gTeamObjDict) {
		if (gTeamObjDict[i].isTeamHasPosition() && gTeamObjDict[i].teamBasic.teamType == teamType) return gTeamObjDict[i];
	}

	return null;
}

function getTeamMembersAsType(teamObject, gameType) {
	if (!teamObject) return null;

	if (!gameType) gameType = consts.UserState.Progress;
	var _teamMembers = teamObject.getTeamMemberList();
	if (!_teamMembers) return null;

	var _activeUser = [];
	for (var i in _teamMembers) {
		if (_teamMembers[i].userBasic.state == gameType) _activeUser.push(_teamMembers[i]);
	}
	return _activeUser;
}

/* *
* todo: 该返回什么数据
* */
function doClearingGameEnd(teamObject, userId, callfunc) {
	var _processTeamMember, _rtnData = {winner: 0, amount: 0, member: []};

	async.series({
		checkState: function(callback) {
			//todo: 修改游戏状态
			var _teamBasic = teamObject.getTeamBasicInfo();
			if (!_teamBasic || _teamBasic.state == consts.GameState.Clear) return callback('clearing process');

			_teamBasic.state = consts.GameState.Clear;

			//todo: 判断游戏人数和游戏状态
			_processTeamMember = teamObject.getProcessTeamMember();
			if (!_processTeamMember || _processTeamMember.length != 1) return callback('error data');

			return callback(null);
		},
		calculateAndUpdate: function(callback) {
			var _teamMemberList = teamObject.getTeamMemberList();
			async.eachSeries(_teamMemberList, function(elem, cb) {
				if (elem.userBasic.state != consts.UserState.Progress) {
					_rtnData.amount += elem.userBasic.bet;
					_rtnData.member.push({userId: elem.userId, minus: elem.userBasic.bet});
					userDao.updateUserBalance({userId: elem.userId, currentType: 1, minus: elem.userBasic.bet}, cb);
				} else if (elem.userBasic.state == consts.UserState.Progress) {
					_rtnData.winner = elem.userId;
					_rtnData.amount += elem.userBasic.bet;
					_rtnData.member.push({userId: elem.userId, minus: 0});
					return cb(null);
				} else {
					return cb(null);
				}
			}, function(error, doc) {
				if (error) return callfunc('error');
				
				userDao.updateUserBalance({userId: _rtnData.winner, currentType: 1, minue: _rtnData.amount}, callback);
			})
		},
		resetTeamInfo: function(callback) {
			//todo: 数据初始化
			var _teamMemberList = teamObject.getTeamMemberList();
			for (var i in _teamMemberList) {
				_teamMemberList[i].userBasic.bet = 0;
				//todo: 清除掉线玩家
				_teamMemberList[i].userCard = {handCard: new Array(), cardType: 0, cardState: consts.CardState.None};
			}

			var _teamBasic = teamObject.getTeamBasicInfo();
			_teamBasic.bet = 0;
			_teamBasic.timestamp = 0;
			_teamBasic.state = consts.GameState.None;

			return callback(null);
		},
		pushMessage2All: function(callback) {
			return callback(null);
		}
	}, function(error, doc) {
		return callfunc(error, _rtnData);
	})
}

function doDeductGameBet(teamObject, userId, state, callfunc) {
	if (!teamObject || !userId) return callfunc('error argument');

	var _deductTeamMember = null;

	async.series({
		deductBalance: function(callback) {
			var _processTeamMember = teamObject.getProcessTeamMember();
			if (!_processTeamMember) return callback('error team object');

			for (var i in _processTeamMember) {
				if (_processTeamMember[i].userBasic.userId == userId) _deductTeamMember = _processTeamMember[i];
			}

			_deductTeamMember.userBasic.gold -= 1;

			return callback(null);
		},
		updateDB: function(callback) {
			//todo: 
			userDao.updateUserBalance({userId: userId, currentType: 1, minus: 1}, function(error, doc) {
				return callback(error);
			})
		},
		pushMessage2All: function(callback) {
			return callback(null);
		}
	}, function(error, doc) {
		return callfunc(null);
	})
	
}