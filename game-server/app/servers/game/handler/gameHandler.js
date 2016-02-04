var utilFunc = require('../../../util/utilFunc');
//var teamManager = require('../../../service/teamManager');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/* *
* @argument: msg: {teamType}
* */
handler.joinTeam = function(msg, session, next) {
	var _param = {userId: session.get('userId'), 
				serverId: session.get('serverId'), 
				teamType: msg.teamType};

	this.app.rpc.manager.teamRemote.applyJoinTeam(session, _param, function(error, doc) {
		return next(null, {code: 200, msg: doc});
	})
}

handler.startTeam = function(msg, session, next) {
	this.app.rpc.manager.teamRemote.applyStartGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.betTeam = function (msg, session, next) {
	this.app.rpc.manager.teamRemote.applyBetGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.raiseTeam = function (msg, session, next) {
	this.app.rpc.manager.teamRemote.applyRaiseGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.checkTeam = function (msg, session, next) {
	this.app.rpc.manager.teamRemote.applyCheckGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.abandonTeam =function (msg, session, next) {
	this.app.rpc.manager.teamRemote.applyAbandonGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.leaveTeam = function(msg, session, next) {
	this.app.rpc.manager.teamRemote.applyLeaveGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.compareTeam = function(msg, session, next) {
	this.app.rpc.manager.teamRemote.applyCompareGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.clearTeam = function (msg, session, next) {
	this.app.rpc.manager.teamRemote.applyClearGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.changeTeam = function(msg, session, next) {
	this.app.rpc.manager.teamRemote.applyChangeGame(session, msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}