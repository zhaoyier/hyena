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
Handler.prototype.entry = function(msg, session, next) {
	//check username and password
	async.series({
		checkAccount: function(callback) {
			
		},
		recordToOnline: function(callback) {

		},
		registToChat: function(callback) {

		}
	}, function(error, doc) {
		if (error) {
			next(null, {code: 201, msg: 'game server error.'});
		} else {
			next(null, {code: 200, msg: 'game server is ok.'});
		}
	})

};
