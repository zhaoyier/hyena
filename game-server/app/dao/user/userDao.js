var async = require('async');
var pomelo = require('pomelo');

var userDao = module.exports;

/* *
* game_user
* game_user_account		//账户
* game_recharge_history
* 
* 
* 
* */

/* *
*
* */
userDao.checkUsernameAndPwd = function(data, callfunc) {
	pomelo.app.get('dbclient').game_user.findAndModify({username: data.username, password: data.password, server: data.server}, [['_id', -1]], {$set: {s: 1}}, {lastLogin: Date.now()/1000|0}, function(error, doc) {
		if (error || !doc) return callback(null, false);

		return callfunc(null, true);
	})
}

/* *
*
* */
userDao.updateUserBalance = function(data, callfunc) {
	var game_user_account = pomelo.app.get('dbclient').game_user_account;
	if (data.currentType == 1) {
		game_user_account.update({_id: data.userId}, {$set: {gold: data.balance}}, {w:1}, function(error, doc) {
			return callfunc(null);
		})
	} else {
		game_user_account.update({_id: data.userId}, {$set: {diamond: data.diamond}}, {w:1}, function(error, doc) {
			return callfunc(null);
		})
	}
	
}

/* *
*
* */
userDao.recordUserRecharge = function(data, callfunc) {
	async.series({
		recordRecharge: function(callback) {
			pomelo.app.get('dbclient').game_recharge_history.insert({userId: data.userId, diamond: 10}, function(error, doc) {
				return callback(null);
			})
		},
		updateBalance: function(callback) {
			pomelo.app.get('dbclient').game_user_account.update({_id: data.userId}, {$inc: {diamond: data.diamond}, $set: {vip: 1}}, {w: 1}, function(error, doc) {
				return callback(null);
			})
		}
	}, function(error, doc) {

	})
}