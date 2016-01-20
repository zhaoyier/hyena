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
	var _validTeam, _self = this, _userBasic;
	async.series({
		addToTeam: function(callback) {
			_validTeam = getHasPositionTeam() || new Team(++gTeamId);
			if (!_validTeam) return callback(201);

			if (_validTeam.addPlayer(data)) return callback(201);

			if (!gTeamObjDict[_validTeam.teamId]) {
				gTeamObjDict[_validTeam.teamId] = _validTeam;
			}

			return callback(null);
		},
		initUserCard: function(callback) {
			GameDao.queryCardData(function(error, doc) {
				if (error) return callback(202);	//todo: 

				_validTeam.initPlayerCard({userId: data.userId, cardType: UtilFunc.getUserCardType(doc)});
				return callback(null);
			})
		}		
	}, function(error, doc) {
		if (error) {
			return func(ServerStatus.COMMON_ERROR);
		} else {
			return func(ServerStatus.OK);
		}
	})
}

handler.applyBet = function(data, callfunc) {
	return callfunc(null);
}

handler.applyRaise = function(data, callfunc) {
	return callfunc(null);
}


function getHasPositionTeam() {
	for (var i in gTeamObjDict) {
		if (gTeamObjDict[i].isTeamHasPosition()) return gTeamObjDict[i];
	}

	return null;
}