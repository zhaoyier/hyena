var async = require('async');
var pomelo = require('pomelo');

var userDao = module.exports;

/* *
* game_user
* game_user_account		//账户
* game_recharge_history
* game_login_log
* 
* 
* */

/* *
*
* */
userDao.checkUsernameAndPwd = function(data, callfunc) {
	// pomelo.app.get('dbclient').game_user.findAndModify({username: data.username, password: data.password}, [['_id', 1]], {$set: {lastLogin: Date.now()/1000|0}}, {}, function(error, doc) {
	// 	if (error || !doc) return callback(error, doc);

	// 	return callfunc(null, doc.value);
	// })
	var _userId = 0;

	async.series({
		checkData: function(callback) {
			pomelo.app.get('dbclient').game_user.findOne({username: data.username, password: data.password}, function(error, doc) {
				if (error) return callback('mongodb error');

				if (!doc) return callback('error username or password');

				_userId = doc._id;

				return callback(null);
			})
		},
		updateData: function(callback) {
			pomelo.app.get('dbclient').game_login_log.save({u: data.username, ct: Date.now()/1000|0}, function(error, doc) {
				if (error) return callback(error);

				return callback(null);
			})
		}
	}, function(error, doc) {
		return callback(error, _userId);
	})
}

userDao.queryUserBalance = function(data, callfunc) {
	pomelo.app.get('dbclient').game_user_account.findOne({_id: data.userId}, function(error, doc) {
		if (error) return callback(error);

		if (!doc) return callback(null, 0);

		//todo:
		if (data.teamType = 0) {
			return callback(null, doc.gold);
		} else {
			return callback(null, doc.diamond);
		}
	})
}

/* *
* Get user basic info
* @param: {Number} userId
* @return: {username, avata, account(gold, diamond)}
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
* Get user information
* @param: {Number} userId
* @return: {username, avata, account(gold, diamond)...}
* */
userDao.queryUserInformation = function(data, callfunc) {
	return callfunc(null);
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