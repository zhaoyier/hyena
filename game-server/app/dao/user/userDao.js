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
	pomelo.app.get('dbclient').game_user.findAndModify({username: data.username, password: data.password}, [['_id', 1]], {$set: {lastLogin: Date.now()/1000|0}}, {}, function(error, doc) {
		if (error || !doc) return callback(error, doc);

		return callfunc(null, doc.value);
	})
}

/* *
*
* */
userDao.queryUserBasic = function(data, callfunc) {
	var _rtnData = {userId: data.userId};

	async.series({
		queryUserBasic: function(callback) {
			pomelo.app.get('dbclient').game_user.findOne({_id: data.userId}, {username: 1, avatar: 1}, function(error, doc) {
				if (error || !doc) return callback('error db or userId');

				if (!doc.username) return callback('error username');
				if (!doc.avatar) doc.avatar = "temp";

				_rtnData['username'] = doc.username;
				_rtnData['avatar'] = doc.avatar;

				return callback(null);
			})
		},
		queryUserAccount: function(callback) {
			pomelo.app.get('dbclient').game_user.findOne({_id: data.userId}, {gold: 1, diamond: 1}, function(error, doc) {
				if (error) return callback(error);

				if (!doc) doc = {gold: 0, diamond: 0};
				if (!doc.gold) doc.gold = 0;
				if (!doc.diamond) doc.diamond = 0;

				_rtnData['gold'] = 0;
				_rtnData['diamond'] = 0;
				return callback(null);
			})
		}
	}, function(error, doc) {
		return callfunc(error, _rtnData);
	})
}

/* *
*
* */
userDao.updateUserBalance = function(data, callfunc) {
	var game_user_account = pomelo.app.get('dbclient').game_user_account;
	if (data.currentType == 1) {
		game_user_account.findAndModify({_id: data.userId}, [['_id', 1]], {$inc: {gold: data.minus}}, {}, function(error, doc) {
			return callfunc(error, doc);
		})

	} else {
		game_user_account.findAndModify({_id: data.userId}, [['_id', 1]], {$inc: {diamond: data.minus}}, {}, function(error, doc) {
			return callfunc(error, doc);
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
			pomelo.app.get('dbclient').game_user_account.update({_id: data.userId}, {$inc: {diamond: data.diamond}, $set: {vip: 1}}, {}, function(error, doc) {
				return callback(null);
			})
		}
	}, function(error, doc) {

	})
}