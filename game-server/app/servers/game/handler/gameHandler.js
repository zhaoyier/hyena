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
	var _self = this;
	var _param = {userId: session.get('userId'), 
				serverId: session.get('serverId'), 
				teamType: msg.teamType};

	var _rtnData = {};

	async.series({
		queryUserBasic: function(callback) {
			userDao.queryUserBasic({userId: session.get('userId')}, function(error, doc) {
				if (error) return callback('201');

				_param['basic'] = doc;
				return callback(null);
			})
		},
		applyJoinTeam: function(callback) {
			_self.app.rpc.manager.teamRemote.applyJoinTeam(session, _param, function(error, doc) {
				if (error) return callback('202');

				_rtnData = doc;
				session.set('teamId', doc.teamId);
				session.pushAll(callback);
			})
		}
	}, function(error, doc) {
		return next(null, {code: 200, msg: _rtnData});
	})
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
	this.app.rpc.manager.teamRemote.applyStartGame(session, msg, function(error, doc) {
		console.log('======>>>1002:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.betTeam = function (msg, session, next) {
	this.app.rpc.manager.teamRemote.applyBetGame(session, msg, function(error, doc) {
		console.log('======>>>1003:\t', error, doc);
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