var async = require('async');
var userDao = require('../../../dao/user/userDao');

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
	var _self = this, _rtnData = {};
	
	async.series({
		checkUserToken: function(callback) {
			return callback(null);
		},
		checkUsernameAndPwd: function(callback) {
			userDao.checkUsernameAndPwd(msg, function(error, doc) {
				if (error) return callback(error);

				_rtnData.userId = doc;

				return callback(false);
			})
		},
		queryUserAccount: function(callback) {
			userDao.queryUserAccount({userId: _rtnData.userId}, function(error, doc) {
				if (error) return callback(error);

				_rtnData.gold = doc.gold;
				_rtnData.diamond = doc.diamond;
				return callback(null);
			})
		},
		recordUserBasic: function(callback) {
			//todo: 打印日志
			//session.set('deviceId', msg.deviceId); //todo: 设备类型
			session.set('serverId', _self.app.get('serverId')); //todo: client上传或重新计算
            session.set('username', msg.username);
            session.set('userId', _rtnData.userId); //todo: 查询数据库返回
            session.set('account', {gold: _rtnData.gold, diamond: _rtnData.diamond});
            session.set('match', {win: 100, lose: 100});
            session.on('closed', onUserLeave.bind(null, _self.app));
            session.pushAll(callback);
		},
		syncToChat: function(callback) {
			console.log("=======>>>10001:\t", session.get('userId'));
			// _self.app.rpc.chat.chatRemote.add(session, player.userId, player.name,
			// 	channelUtil.getGlobalChannelName(), callback);
			return callback(null);
		}
	}, function(error, doc) {
		if (error) {
			return next(err, {code: Code.FAIL});
		} else {
			return next(null, {code: 200, rtn: _rtnData});
		}
		
	})
}

handler.register = function (msg, session, next) {
	async.series({
		checkRule: function(callback) {
			if (typeof(msg.username) != 'string') return callback('username must be string');

			if (msg.username.length < 6) return callback('uesrname less ');

			if (msg.username.search(/\s/) != -1) return callback('username can not contain empty character');

			if (msg.password.length < 6) return callback('password less ');

			if (msg.repassword.length < 6) return callback('repassword less');

			if (msg.password != msg.repassword) return callback('password != repassword');

			return callback(null);
		},
		checkRepeat: function(callback) {
			userDao.checkRegistUsername({username: msg.username}, function(error, doc) {
				if (error) return callback('db error');

				if (doc == true) return callback('username repeat');

				return callback(null);
			})
		},
		registerUser: function(callback) {
			if (!msg.avatar) msg.avatar = '1';
			userDao.registerNewPlayer({username: msg.username, password: msg.password, avatar: msg.avatar}, function(error, doc) {
				if (error) return  callback(error);

				return callback(null);
			})
		}
	}, function(error, doc) {
		if (error) {
			return next(null, {code: 201});
		} else {
			return next(null, {code: 200});
		}
		
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
// handler.exit = function(msg, session, next) {
// 	return next(null, {code: 200});
// }

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session, reason) {
	//todo: 处理玩家退出游戏
	return ;
}

// /**
//  * New client entry chat server.
//  *
//  * @param  {Object}   msg     request message
//  * @param  {Object}   session current session object
//  * @param  {Function} next    next stemp callback
//  * @return {Void}
//  */
// handler.enter2 = function(msg, session, next) {
// 	var self = this;
// 	var rid = msg.rid;
// 	var uid = msg.username + '*' + rid
// 	var sessionService = self.app.get('sessionService');

// 	//duplicate log in
// 	if( !! sessionService.getByUid(uid)) {
// 		next(null, {
// 			code: 500,
// 			error: true
// 		});
// 		return;
// 	}

// 	session.bind(uid);
// 	session.set('rid', rid);
// 	session.push('rid', function(err) {
// 		if(err) {
// 			console.error('set rid for session service failed! error is : %j', err.stack);
// 		}
// 	});
// 	session.on('closed', onUserLeave.bind(null, self.app));

// 	//put user into channel
// 	self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
// 		next(null, {
// 			users:users
// 		});
// 	});
// };

// /**
//  * User log out handler
//  *
//  * @param {Object} app current application
//  * @param {Object} session current session object
//  *
//  */
// var onUserLeave2 = function(app, session) {
// 	if(!session || !session.uid) {
// 		return;
// 	}
// 	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
// };