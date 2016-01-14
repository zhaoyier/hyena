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
handler.enter = function(msg, session, next) {
	var _username = msg.username;
	var _password = msg.password;
	if (msg.username == 'admin' && msg.password == 'admin') {
		next(null, {code: 200, data: {username: 'admin', password: 'admin'}}});
	} else {
		next(null, {code: 201, data: {username: 'admin', password: 'admin'}}});
	}
};

/**
* 离开游戏
* */
handler.level = function(msg, session, next) {
	next(null, {});
}

/**
* 心跳包
* */
handler.heart = function(msg, session, next) {
	next(null, {});
}

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
	
};