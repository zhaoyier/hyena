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
	var _teamObject = null;
	var _rtnData = {teamId: 0, member: []};

	async.series({
		checkParam: function(callback) {
			if (data.teamType !=  consts.TeamType.Gold && data.teamType != consts.TeamType.Diamond) return callback('error team type');

			return callback(null);
		},
		addToTeam: function(callback) {
			_teamObject = getHasPositionTeam(data.teamType) || new Team(++gTeamId, data.teamType);

			if (!_teamObject) return callback('create team error');

			if (!_teamObject.addPlayer(data)) return callback('add player error');

			var _teamId = _teamObject.getTeamBasicInfo().teamId;

			if (!gTeamObjDict[_teamId]) gTeamObjDict[_teamId] = _teamObject;

			_rtnData.teamId = _teamId;
			_rtnData.member = _teamObject.getTeamMemberBasic();

			return callback(null);
		},
		pushMessage: function(callback) {
			return callback(null);
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
		queryTeamObj: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			var _processTeamMember = _teamObject.getProcessTeamMember();
			if (_processTeamMember.length < 2) return callback("less limit member");

			return callback(null);
		},
		initUserCard: function(callback) {
			//todo: 计算该玩家的权重之，分配牌型
			var _weightScore = utilFunc.getUserWeightScore();
			_userWeight = utilFunc.getUserCardType(_weightScore);
			var _teamMemberList = _teamObject.getTeamMemberList();
			for (var i in _teamMemberList) {
				if (_teamMemberList[i].userId == data.userId) {
					_rtnData.push(data.userId);
					_teamMemberList[i].userBasic.weight = _userWeight;
					_teamMemberList[i].userBasic.state = consts.UserState.Ready;
					_teamMemberList[i].userBasic.activeTime = Date.now()/1000|0;
				}
				//todo: 是否需要加入其他返回数据
				_rtnData.push({userId: _teamMemberList[i].userId, state: _teamMemberList[i].userBasic.state}); 
			}
			return callback(null);
		},
		pushMessage: function(callback) {
			return callback(null);
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
		queryTeamObj: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

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
			_teamObject.pushStartMsg2All(_rtnData, callback);
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
		queryTeamObj: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkTeamMember: function(callback) {
			var _teamMemberList = _teamObject.getProcessTeamMember();
			if (_teamMemberList.length == 1) {
				doClearingGameEnd(_teamObject, data.userId, function(error, doc) {
					if (error) return callback(error);
					_rtnData = doc; _rtnData['gameState'] = consts.GameState.Clear;
					return callback(null);
				});
			} else if (_teamMemberList.length == 2) {
				var _selfBasic = _teamObject.getUserBasic(data.userId);
				if (!_selfBasic) return callback('can not find user information');
				var _userBetType = utilFunc.getUserBetType(_selfBasic.userCard.cardState, data.bet);
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

handler.applyRaiseGame = function(data, callfunc) {
	return callfunc(null);
}

handler.applyCheckGame = function(data, callfunc) {
	return callfunc(null);
}

handler.applyAbandonGame = function(data, callfunc) {
	return callfunc(null);
}

handler.applyLeaveGame = function(data, callfunc) {
	return callfunc(null);
}

handler.applyCompareGame = function(data, callfunc) {
	return callfunc(null);
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
function doClearingGameEnd(teamObj, userId, callfunc) {
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
			var _teamMemberList = teamObj.getTeamMemberList();
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
			var _teamMemberList = teamObj.getTeamMemberList();
			for (var i in _teamMemberList) {
				_teamMemberList[i].userBasic.bet = 0;
				//todo: 清除掉线玩家
				_teamMemberList[i].userCard = {handCard: new Array(), cardType: 0, cardState: consts.CardState.None};
			}

			var _teamBasic = teamObj.getTeamBasicInfo();
			_teamBasic.teamBasic.bet = 0;
			_teamBasic.teamBasic.timestamp = 0;
			_teamBasic.teamBasic.state = consts.GameState.None;

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