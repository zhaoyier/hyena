var async = require('async');
var userDao = require('../../../dao/game/userDao');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
		this.app = app;
};

var handler = Handler.prototype;

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.login = function(msg, session, next) {
	async.series({
		checkUserToken: function(callback) {
			return callback(null);
		},
		checkUsernameAndPwd: function(callback) {
			userDao.checkUsernameAndPwd(msg, function(error, doc) {
				if (doc == false) return callback(null);

				return callback(false);
			})
		},
		recordUserBasic: function(callback) {
			session.set('deviceId', msg.deviceId); //todo: 设备类型
			session.set('serverId', msg.serverId); //todo: client上传或重新计算
            session.set('username', msg.username);
            session.set('userId', 101); //todo: 查询数据库返回
            session.on('closed', onUserLeave.bind(null, self.app));
            session.pushAll(callback);
		},
		syncToChat: function(callback) {
			// self.app.rpc.chat.chatRemote.add(session, player.userId, player.name,
			// 	channelUtil.getGlobalChannelName(), callback);
			return callback(null);
		}
	}, function(error, doc) {
		if (error) {
			next(err, {code: Code.FAIL});
			return ;
		}

		next(null, {code: 200, user});
	})
}

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.exit = function(msg, session, next) {
	return next(null, {code: 200});
}

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session, reason) {
	return ;
}

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.enter2 = function(msg, session, next) {
	var self = this;
	var rid = msg.rid;
	var uid = msg.username + '*' + rid
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));

	//put user into channel
	self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
		next(null, {
			users:users
		});
	});
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave2 = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};