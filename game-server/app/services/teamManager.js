var async = require('async');
var pomelo = require('pomelo');


var GameDao = require('../dao/game/gameDao');
var Team = require('../domain/entity/team');
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
handler.applyJoinTeam = function(data, func) {
	var _teamObject, _self = this, _userBasic;

	async.series({
		addToTeam: function(callback) {
			_teamObject = getHasPositionTeam() || new Team(++gTeamId);
			if (!_teamObject) return callback(201);

			if (_teamObject.addPlayer(data)) return callback(201);

			if (!gTeamObjDict[_teamObject.teamId]) {
				gTeamObjDict[_teamObject.teamId] = _teamObject;
			}

			return callback(null);
		}
	}, function(error, doc) {
		if (error) {
			return func(ServerStatus.COMMON_ERROR);
		} else {
			return func(ServerStatus.OK);
		}
	})
}

handler.applyStartGame = function(data, func) {
	async.series({
		updateTeamStatus: function(callback) {
			return callback(null);
		},
		pushMessageToTeam: function(callback) {
			//通知所有队友开始
			return callback(null);
		},
	}, function(error, doc) {

	})
}

handler.applyChangeTeam = function(data, func) {
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
	//退出之前的team
	//判断有没有空闲的team
	//判断
}

handler.applyCheckCard = function(data, func) {
	return func(null);
}

handler.applyBet = function(data, func) {
	return func(null);
}

handler.applyRaise = function(data, func) {
	return func(null);
}

handler.applyLeave = function(data, func) {

}

function getHasPositionTeam() {
	for (var i in gTeamObjDict) {
		if (gTeamObjDict[i].isTeamHasPosition()) return gTeamObjDict[i];
	}

	return null;
}