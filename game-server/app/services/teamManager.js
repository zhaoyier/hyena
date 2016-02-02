var async = require('async');
var pomelo = require('pomelo');


var Team = require('../domain/entity/Team');
var UtilFunc = require('../util/utilFunc');
var consts = require('../config/consts');
var ServerStatus = require('../config/consts').ServerStatus;
var GameDao = require('../dao/game/gameDao');
var UserDao = require('../dao/user/userDao');

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
	var _teamObject = null, _teamId = 0;

	async.series({
		checkArgs: function(callback) {
			if (data.teamType !=  consts.TeamType.Gold && data.teamType != consts.TeamType.Diamond) return callback('error team type');

			return callback(null);
		},
		addToTeam: function(callback) {
			_teamObject = getHasPositionTeam(data.teamType) || new Team(++gTeamId, data.teamType);
			if (!_teamObject) return callback('create team error');

			if (_teamObject.addPlayer(data)) return callback('add player error');

			var _teamBasic = _teamObject.getTeamBasicInfo();
			_teamId = _teamBasic.teamId;

			if (!gTeamObjDict[_teamObject.teamId]) {
				gTeamObjDict[_teamObject.teamId] = _teamObject;
			}

			return callback(null);
		},
		pushMessage: function(callback) {
			return callback(null);
		}
	}, function(error, doc) {
		if (error) {
			return callfunc(error, doc);
		} else {
			return callfunc(error, doc);
		}
	})
}

handler.applyStartGame = function(data, callfunc) {
	var _teamObject = null, _rtnData = [];
	async.series({
		queryTeamObj: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		initCardBasic: function(callback) {
			var _nowTimestamp = Date.now()/1000|0;
			var _teamMember = _teamObject.getTeamMemberList();
			if (_teamMember.length < 2) return callback('team member less limit');

			for (var i in _teamMember) {
				if ((_nowTimestamp - _teamMember[i].userBasic.lastHeart) >= ACTIVE_USER_TIME) _teamMember[i].userBasic.state = consts.UserState.Offline;

				if (_teamMember[i].userBasic.state == consts.UserState.None 
					|| _teamMember[i].userBasic.state == consts.UserState.Progress) {
 					//初始化
 					_teamMember[i].userCard.handCard = new Array();
 					_teamMember[i].userCard.cardType = consts.CardType.None;
 					_teamMember[i].userCard.cardState = consts.CardState.None;
				} else {
					_teamMember.splice(i, 1);
				}
			}

			return callback(null);
		},
		filterData: function(callback) {
			//筛选数据, 金额
			var _teamMember = _teamObject.getTeamMemberList();
			if (_teamMember.length < 2) return callback('team member less limit');

			for (var i in _teamMember) {
				_rtnData.push({userId: _teamMember[i].userId});
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
			return callfunc(error, doc);
		}
	})
}

handler.applyBetGame = function(data, callfunc) {
	var _teamObject = null, _rtnData = [], _gameState = consts.GameState.None;
	var _teamMembers, _userId = data.userId;

	async.series({
		queryTeamObj: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkTeamMember: function(callback) {
			var _activeUser = 0;
			_teamMembers = getTeamMembersAsType(_teamObject);
			if (_teamMembers == null) return callback('query team member list error');

			if (_teamMembers.length == 1) {
				_gameState = consts.GameState.Clear;
			} 

			if (_teamMembers.length >= 2) {
				_gameState = consts.GameState.Process;
			}

			return callback(null);
		},
		updateUserBalance: function(callback) {
			if (_gameState == consts.GameState.Clear) {

			} else if (_gameState == consts.GameState.Process) {
				_teamObject.teamBasic.bet += 10;	//todo
				for (var i in _teamMembers) {
					if (_teamMembers[i].userId == _userId) {
						if (_teamMembers[i].userBasic.bet >= 10) {	//todo
							_teamMembers[i].userBasic.bet -= 10;
						} else {
							return callback('lack of balance');
						}
					} 
				}
			} else {

			}
			return callback(null);
		},
		pushMessage: function(callback) {
			if (_gameState == consts.GameState.Clear) {

			} else if (_gameState == consts.GameState.Process) {

			} else {

			}
			return callback(null);
		}
	}, function(error, doc) {
		return callfunc(error, doc);
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
		if (gTeamObjDict[i].isTeamHasPosition() && gTeamObjDict[i].team.teamType == teamType) return gTeamObjDict[i];
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
function clearingGameEnd(teamObj, userId, callfunc) {
	var _processTeamMember;

	async.series({
		checkState: function(callback) {
			//todo: 修改游戏状态
			var _teamBasic = teamObject.getTeamBasicInfo();
			if (!_teamBasic || _teamBasic.state == consts.GameState.Clear) return callback('clearing process');

			_teamBasic.state = consts.GameState.Clear;

			//todo: 判断游戏人数和游戏状态
			_processTeamMember = teamObject.getProcessTeammember();
			if (!_processTeamMember || _processTeamMember.length != 1) return callback('error data');

			return callback(null);
		},
		updateDB: function(callback) {
			var _winAmount = 0;
			var _teamMember = teamObj.getTeamMemberList();
			async.eachSeries(_teamMember, function(elem, cb) {
				if (elem.userBasic.state == consts.UserState.Abandon) {
					_winAmount += elem.userBasic.bet;
					userDao.updateUserBalance({userId: elem.userId, currentType: 1, minus: elem.userBasic.bet}, cb);
				} else {
					return cb(null);
				}
			}, function(error, doc) {
				if (error) return callfunc('error');

				userDao.updateUserBalance({userId: _processTeamMember.userId, currentType: 1, minue: _winAmount}, callback);
			})
		},
		resetTeamInfo: function(callback) {
			//todo: 数据初始化
			var _teamMember = teamObj.getTeamMemberList();
			for (var i in _teamMember) {
				_teamMember[i].userBasic.bet = 0;
				_teamMember[i].userCard = {handCard: new Array(), cardType: 0, cardState: consts.CardState.None};
			}

			var _teamBasic = teamObj.getTeamBasicInfo();
			_teamBasic.teamBasic.state = consts.GameState.None;
			_teamBasic.teamBasic.timestamp = 0;
			_teamBasic.teamBasic.bet = 0;

			return callback(null);
		}
	}, function(error, doc) {
		return callfunc(null);
	})
}

function deductGameBet(teamObject, userId, state, callfunc) {
	if (!teamObject || !userId) return callfunc('error argument');

	var _deductTeamMember = null;

	async.series({
		deductBalance: function(callback) {
			var _processTeamMember = teamObject.getProcessTeammember();
			if (!_processTeamMember) return callback('error team object');

			for (var i in _processTeamMember) {
				if (_processTeamMember[i].userBasic.userId == userId) _deductTeamMember = _processTeamMember[i];
			}

			_deductTeamMember.userBasic.gold -= 1;

			return callback(null);
		},
		updateDB: function(callback) {
			//todo: 
			UserDao.updateUserBalance({userId: userId, currentType: 1, minus: 1}, function(error, doc) {
				return callback(error);
			})
		},
		modifyState: function(callback) {
			return callback(null);
		}
	}, function(error, doc) {
		return callfunc(null);
	})
	
}