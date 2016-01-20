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

// TeamRemote.prototype.updateMemberInfo = function(args, callback){

// }

// TeamRemote.prototype.chatInTeam = function(args, callback){

// }

// TeamRemote.prototype.applyLeaveTeam = function(arg, callback) {

// }