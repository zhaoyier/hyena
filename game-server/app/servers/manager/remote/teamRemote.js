//var utils = require('../../../util/utils');
var teamManager = require('../../../services/teamManager');

module.exports = function(){
	return new TeamRemote();
}

var TeamRemote = function(){

}

/* *
* @param: 
* */
TeamRemote.prototype.applyJoinTeam = function(args, callfunc) {
	teamManager.applyJoinTeam(args, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyPrepareGame = function(data, callfunc) {
	teamManager.applyPrepareGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyStartGame = function(data, callfunc) {
	teamManager.applyStartGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyBetGame = function(data, callfunc) {
	teamManager.applyBetGame(data, function(error, doc) {
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
	teamManager.applyCheckGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyAbandonGame = function(data, callfunc) {
	teamManager.applyAbandonGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyLeaveGame = function(data, callfunc) {
	teamManager.applyLeaveGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyCompareGame = function(data, callfunc) {
	teamManager.applyCompareGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyClearGame = function(data, callfunc) {
	teamManager.applyClearGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}

/* *
* @param: 
* */
TeamRemote.prototype.applyChangeGame = function(data, callfunc) {
	teamManager.applyChangeGame(data, function(error, doc) {
		return callfunc(error, doc);
	})
}