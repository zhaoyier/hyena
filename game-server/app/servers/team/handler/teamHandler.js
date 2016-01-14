var teamManager = require('../../../teamManager');

module.exports = function(app) {
  return new Handler(app);
};


var Handler = function(app) {
  this.app = app;
  this.teamNameArr = dataApi.team.all();
  this.teamNameArr.length = Object.keys(this.teamNameArr).length;
};

Handler.prototype.enterTeam = function(msg, session, next) {
	//检查是否有空位置, 如果没有空位置的创建
	teamManager.applyJoinTeam({userId: msg.userId}, function(error, doc) {
		if (!!doc) {
			return next(null, {code: 200, data: doc});
		} else {
			return next(null, {code: 202});
		}
	});	
}

Handler.prototype.leaveTeam = function(msg, session, next) {
	teamManager.applyLeaveTeam({userId: msg.userId})
}

Handler.prototype.readyGame = function(msg, session, next) {

}

Handler.prototype.clearGame = function(msg, session, next) {

},

Handler.prototype.dealGame = function(msg, session, next) {

}

