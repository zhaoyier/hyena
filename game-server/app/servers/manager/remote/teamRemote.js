var utils = require('../../../util/utils');
var teamManager = require('../../../services/teamManager');

module.exports = function(){
	return new TeamRemote();
}

var TeamRemote = function(){

}

TeamRemote.prototype.applyJoinTeam = function(args, cb) {
	// teamManager.applyJoinTeam(args, function(error, doc) {
	// 	return callback(null);
	// })
	return callback(null);
}

TeamRemote.prototype.updateMemberInfo = function(args, cb){

}

TeamRemote.prototype.chatInTeam = function(args, cb){

}