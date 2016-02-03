var utilFunc = require('../../../util/utilFunc');
//var teamManager = require('../../../service/teamManager');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.joinTeam = function(msg, session, next) {
	var _userBasic = {userId: 1, username: 'admin'};
	var _userId = session.get('userId');
	var _serverId = session.get('serverId');

	this.app.rpc.manager.teamRemote.applyJoinTeam(session, {userId: msg.userId, teamType: 1, serverId: _serverId}, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
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