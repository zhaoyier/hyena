var async = require('async');

var userDao = require('../../../dao/user/userDao');
var channelUtil = require('../../../util/channelUtil');

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
 * @param  {username, password, serverId}   msg     request message
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
			session.set('serverId', msg.serverId); //客户端上传
            session.set('username', msg.username);
            session.set('userId', _rtnData.userId); //todo: 查询数据库返回
            session.set('account', {gold: _rtnData.gold, diamond: _rtnData.diamond});
            session.set('match', {win: 100, lose: 100});
            session.on('closed', onUserLeave.bind(null, _self.app));
            session.pushAll(callback);
		},
		syncToChat: function(callback) {
			_self.app.rpc.chat.chatRemote.add(session, _rtnData.userId, msg.username, channelUtil.getGlobalChannelName(), msg.serverId, callback);
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
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session, reason) {
	//todo: 处理玩家退出游戏
	app.rpc.chat.chatRemote.leave(session, session.get('userId'), channelUtil.getGlobalChannelName(), function(error, doc) {
		return ;
	})	
}