var async = require('async');

var Team = require('../domain/entity/team');
var utilFun = require('../util/UtilityFunction');
var userDao = require('../dao/userDao');
var consts = require('../consts/consts');

var handler = module.exports;

// global team container(teamId:teamObj)
var gTeamObjectDict = {};
var gFreeTeamObjectDict = {};
// global team id
var gTeamId = 0;

/* *
* input: {userId, teamType}
* */
handler.applyJoinTeam = function(data, cb) {
	//判断是否有空闲队伍
	var _teamObj = null, _userType;

	async.series({
		analyseData: function(callback) {
			userDao.queryMatchRecord(data.userId, function(error, doc) {
				_userType = utilFun.anlyseMatchRecord(doc);

				return callback(null);
			});
		},
		//检查是否有空的队伍可以加入
		checkFreeTeam: function(callback) {
			for (var i in gTeamObjectDict) {
				if (gTeamObjectDict[i].teamType == data.teamType 
					&& gTeamObjectDict[i].userDataArray.length < consts.Team.MAX_PLAYER_NUM) {
					_teamObj = gTeamObjectDict[i];
					break;
				}
			}

			return callback(null);
		},
		//加入房间
		joinTeam: function(callback) {
			if (!!_teamObj) {
				_teamObj.addPlayer(data.userId);
			} else {
				_teamObj = createTeam();
				gTeamObjDict[_teamObj.teamId] = _teamObj;
			}

			return callback(null);
		}
	}, function(error, doc) {
		return cb(null, _teamObj);
	})
}

handler.getTeamById = function(teamId) {
	var teamObj = gTeamObjectDict[teamId];
	return teamObj || null;
}

var createTeam = function(data) {
	var _teamObj = new Team(++gTeamId);

	_teamObj.addPlayer(data.userId);

	return _teamObj;
};


