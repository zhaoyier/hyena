var teamManager = require('../../../service/teamManager');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.joinTeam = function(msg, session, next) {
	this.app.rpc.manager.teamRemote.applyJoinTeam(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.startTeam = function(msg, session, next) {
	this.app.rpc.manager.teamRemote.applyStartGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.betTeam = function (msg, session, next) {
	
}

handler.raiseTeam = function (msg, session, next) {

}

handler.exitTeam = function(msg, session, next) {

}

handler.clearGame = function (msg, session, next) {

}

handler.changeTeam = function(msg, session, next) {
	teamManager.applyChangeTeam(msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}