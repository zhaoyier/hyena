var async = require('async');
var pomelo = require('pomelo');


var GameDao = require('../dao/game/gameDao');
var Team = require('../domain/entity/Team');
var UtilFunc = require('../util/utilFunc');
var ServerStatus = require('../config/consts').ServerStatus;

var server_resp_hash = require('../config/server_resp_hash').data;

var handler = module.exports;

// global team container(teamId:teamObj)
var gTeamObjDict = {};
// global team id
var gTeamId = 0;

/* *
* @param: data {} 
* @api public
* */
handler.applyJoinTeam = function(data, callfunc) {
	var _teamObject, _self = this, _userBasic;

	async.series({
		addToTeam: function(callback) {
			_teamObject = getHasPositionTeam(data.teamType) || new Team(++gTeamId);
			if (!_teamObject) return callback(201);

			if (_teamObject.addPlayer(data)) return callback(201);

			if (!gTeamObjDict[_teamObject.teamId]) {
				gTeamObjDict[_teamObject.teamId] = _teamObject;
			}

			return callback(null);
		}
	}, function(error, doc) {
		if (error) {
			return callfunc(ServerStatus.COMMON_ERROR);
		} else {
			return callfunc(ServerStatus.OK);
		}
	})
}

handler.applyStartGame = function(data, callfunc) {
	var _teamObject = gTeamObjDict[data.teamId];
	_teamObject.startTeamGame(data, function(error, doc) {
		return callfunc(null);
	})
}

handler.applyBetGame = function(data, callfunc) {
	return callfunc(null);
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