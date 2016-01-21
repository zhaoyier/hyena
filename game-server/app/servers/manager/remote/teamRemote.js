var utils = require('../../../util/utils');
var teamManager = require('../../../service/teamManager');

module.exports = function(){
	return new TeamRemote();
}

var TeamRemote = function(){

}

TeamRemote.prototype.applyJoinTeam = function(args, callfunc) {
	teamManager.applyJoinTeam(args, function(error, doc) {
		return callfunc(null);
	})
}

TeamRemote.prototype.applyStartGame = function(data, callfunc) {
	teamManager.applyStartGame(data, function(error, doc) {
		return callfunc(null);
	})
}


TeamRemote.prototype.applyBetGame = function(data, callfunc) {

}

TeamRemote.prototype.applyRaiseGame = function(data, callfunc) {
	
}

TeamRemote.prototype.applyCheckGame = function(data, callfunc) {
	
}

TeamRemote.prototype.applyAbandonGame = function(data, callfunc) {
	
}

TeamRemote.prototype.applyLeaveGame = function(data, callfunc) {
	
}

TeamRemote.prototype.applyCompareGame = function(data, callfunc) {
	
}

TeamRemote.prototype.applyClearGame = function(data, callfunc) {
	
}

TeamRemote.prototype.applyChangeGame = function(data, callfunc) {
	
}