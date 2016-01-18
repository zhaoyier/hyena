var async = require('async');
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
				_validTeam = _self.createTeam();
			}

			return callback(null);
		},
		addToTeam: function(callback) {
			_validTeam.addPlayer({});
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