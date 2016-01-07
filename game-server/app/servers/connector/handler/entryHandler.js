var async = require('async');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.login = function(msg, session, next) {
	async.series({
		checkUserToken: function(callback) {
			return callback(null);
		},
		checkAccount: function(callback) {
			return callback(null);
		},
		recordToOnline: function(callback) {
			return callback(null);
		},
		registToChat: function(callback) {
			return callback(null);
		}
	}, function(error, doc) {
		if (error) {
			next(null, {code: 201, msg: 'game server error.'});
		} else {
			next(null, {code: 200, msg: 'game server is ok.'});
		}
	})
};

Handler.prototype.regist = function(msg, session, next) {
	next(null, {code: 200, msg: 'OK'});
}

Hander.prototype.updateBasic = function(first_argument) {
	next(null, {code: 200, msg: 'OK'});
};
