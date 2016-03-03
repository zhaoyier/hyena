var async = require('async');
var utilFunc = require('../../../util/utilFunc');
var userDao = require('../../../dao/user/userDao');
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
				username: session.get('username'),
				teamType: msg.teamType};

	this.app.rpc.manager.teamRemote.applyJoinTeam(session, _param, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	});
}

/* *
* @param: 
* */
handler.prepareTeam = function(msg, session, next) {
	var _param = {userId: session.get('userId'),
			teamId: session.get('teamId')
		};

	this.app.rpc.manager.teamRemote.applyPrepareGame(session, _param, function(error, doc) {
		console.log('======>>>1001:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.startTeam = function(msg, session, next) {
	var _param = {userId: session.get('userId'),
			teamId: session.get('teamId')};

	this.app.rpc.manager.teamRemote.applyStartGame(session, _param, function(error, doc) {
		console.log('======>>>1002:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}

/* *
* @param: {Number} userId
* @param: {Number} teamId
* */
handler.betTeam = function (msg, session, next) {
	var _param = {userId: session.get('userId'),
			teamId: session.get('teamId')};

	this.app.rpc.manager.teamRemote.applyBetGame(session, _param, function(error, doc) {
		console.log('======>>>1003:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}

// handler.raiseTeam = function (msg, session, next) {
// 	var _param = {userId: session.get('userId'),
// 			teamId: session.get('teamId')};

// 	this.app.rpc.manager.teamRemote.applyRaiseGame(session, _param, function(error, doc) {
// 		console.log('======>>>1004:\t', error, doc);
// 		return next(null, {code: 200, msg: 'ok'});
// 	})
// }

handler.checkTeam = function (msg, session, next) {
	var _param = {userId: session.get('userId'),
			teamId: session.get('teamId')};

	this.app.rpc.manager.teamRemote.applyCheckGame(session, _param, function(error, doc) {
		console.log('======>>>1005:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.abandonTeam =function (msg, session, next) {
	var _param = {userId: session.get('userId'),
			teamId: session.get('teamId')};

	this.app.rpc.manager.teamRemote.applyAbandonGame(session, _param, function(error, doc) {
		console.log('======>>>1006:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.leaveTeam = function(msg, session, next) {
	var _param = {userId: session.get('userId'),
			teamId: session.get('teamId')};

	this.app.rpc.manager.teamRemote.applyLeaveGame(session, _param, function(error, doc) {
		console.log('======>>>1007:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.compareTeam = function(msg, session, next) {
	var _param = {userId: session.get('userId'),
			teamId: session.get('teamId')};

	this.app.rpc.manager.teamRemote.applyCompareGame(session, _param, function(error, doc) {
		console.log('======>>>1008:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}

// handler.clearTeam = function (msg, session, next) {
// 	this.app.rpc.manager.teamRemote.applyClearGame(session, msg, function(error, doc) {
// 		return next(null, {code: 200, msg: 'ok'});
// 	})
// }

handler.changeTeam = function(msg, session, next) {
	var _param = {userId: session.get('userId'),
			teamId: session.get('teamId')};

	this.app.rpc.manager.teamRemote.applyChangeGame(session, _param, function(error, doc) {
		console.log('======>>>1009:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}