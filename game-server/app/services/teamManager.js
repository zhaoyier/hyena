var async = require('async');
var pomelo = require('pomelo');


var GameDao = require('../dao/game/gameDao');
var Team = require('../domain/entity/Team');
var UtilFunc = require('../util/utilFunc');
var consts = require('../config/consts');
var ServerStatus = require('../config/consts').ServerStatus;

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
	var _teamMember, _userId = data.userId;

	async.series({
		queryTeamObj: function(callback) {
			_teamObject = gTeamObjDict[data.teamId];
			if (!_teamObject) return callback('error team id');

			return callback(null);
		},
		checkTeamMember: function(callback) {
			var _activeUser = 0;
			_teamMember = _teamObject.getTeamMemberList();
			if (!_teamMember) return callback('query team member list error');

			for (var i in _teamMember) {
				if (_teamMember[i].userBasic.state == consts.UserState.Progress) ++_activeUser;
			}

			if (_activeUser == 1) {
				_gameState = consts.GameState.Clear;
			} else if (_activeUser >= 2) {
				_gameState = consts.GameState.Process;
			}
			return callback(null);
		},
		updateUserBalance: function(callback) {
			if (_gameState == consts.GameState.Clear) {

			} else if (_gameState == consts.GameState.Process) {
				_teamObject.teamBasic.bet += 10;	//todo
				for (var i in _teamMember) {
					if (_teamMember[i].userId == _userId) {
						if (_teamMember[i].userBasic.bet >= 10) {	//todo
							_teamMember[i].userBasic.bet -= 10;
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

function getTeamMembersByType(teamObject, gameType) {
	if (!teamObject) return null;

	if (!gameType) gameType = consts.UserState.Progress;
	var _teamMember = _teamObject.getTeamMemberList();
	if (!_teamMember) return null;

	var _activeUser = 0;
	for (var i in _teamMember) {
		if (_teamMember[i].userBasic.state == consts.UserState.Progress) ++_activeUser;
	}
	return _activeUser;
}