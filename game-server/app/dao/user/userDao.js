var async = require('async');
var pomelo = require('pomelo');

var userDao = module.exports;

userDao.checkUsernameAndPwd = function(data, callback) {
	pomelo.app.get('dbclient').game_user.findAndModify({username: data.username, password: data.password, server: data.server}, [['_id', -1]], {$set: {s: 1}}, {lastLogin: Date.now()/1000|0}, function(error, doc) {
		if (error || !doc) return callback(null, false);

		return callback(null, true);
	})
}

userDao.update = function() {
	return null;
}