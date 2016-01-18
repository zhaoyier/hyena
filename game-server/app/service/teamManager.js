var async = require('async');
var pomelo = require('pomelo');

var gameDao = require('../dao/game/gameDao');
var Team = require('../domain/entity/team');

var handler = module.exports;

// global team container(teamId:teamObj)
var gTeamObjDict = {};
// global team id
var gTeamId = 0;

handler.applyJoinTeam = function(data, callFunc) {
	var _validTeam, _self = this;
	async.series({
		queryValidyTeam: function(callback) {
			_validTeam = getHasPositionTeam();
			if (!_validTeam) {
				_validTeam = new Team(++gTeamId);
			}

			return callback(null);
		},
		temp: function(callback) {
			pomelo.app.get('dbclient').game_user.findOne(function(error, doc) {
				console.log('=====>>>1006:\t', error, doc);
				return callback(null);
			})
		},
		addPlayerToTeam: function(callback) {
			_validTeam.addPlayer({});

			if (!gTeamObjDict[_validTeam.teamId]) {
				gTeamObjDict[_validTeam.teamId] = _validTeam;
			}
			return callback(null);
		}
	}, function(error, doc) {
		return callFunc(null, null);
	})
}

handler.createTeam = function(data) {
	var _newTeam = new Team(++gTeamId);
	return _newTeam;
}


function getHasPositionTeam() {
	for (var i in gTeamObjDict) {
		if (gTeamObjDict[i].isTeamHasPosition()) return gTeamObjDict[i];
	}

	return null;
}