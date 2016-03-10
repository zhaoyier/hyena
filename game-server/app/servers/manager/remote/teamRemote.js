//var utils = require('../../../util/utils');
var teamService = require('../../../services/teamService');

module.exports = function(){
	return new TeamRemote();
}

var TeamRemote = function(){

}

/* *
* @param: 
* */
TeamRemote.prototype.applyJoinTeam = function(args, callfunc) {
	teamService.applyJoinTeam(args, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyPrepareGame = function(data, callfunc) {
	teamService.applyPrepareGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyStartGame = function(data, callfunc) {
	teamService.applyStartGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyBetGame = function(data, callfunc) {
	teamService.applyBetGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
// TeamRemote.prototype.applyRaiseGame = function(data, callfunc) {
// 	return callfunc(error, doc);
// }

/* *
* @param: 
* */
TeamRemote.prototype.applyCheckGame = function(data, callfunc) {
	teamService.applyCheckGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyAbandonGame = function(data, callfunc) {
	teamService.applyAbandonGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyLeaveGame = function(data, callfunc) {
	teamService.applyLeaveGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyCompareGame = function(data, callfunc) {
	teamService.applyCompareGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
// TeamRemote.prototype.applyClearGame = function(data, callfunc) {
// teamService.applyClearGame(data, function(error, doc) {
// 		return callfunc(error, doc);
// 	})
// }

/* *
* @param: 
* */
TeamRemote.prototype.applyChangeGame = function(data, callfunc) {
	teamService.applyChangeGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}