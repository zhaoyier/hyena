var async = require('async');
var pomelo = require('pomelo');

var gameDao = module.exports;

gameDao.queryCardData = function(func) {
	//帐号类型、VIP等级、历史比赛
	var _rtn = {type: 0, vip: 0, win: 0, fail: 0};
	async.series({
		one: function(callback) {
			pomelo.app.get('dbclient').game_user.findOne(function(error, doc) {
				return callback(null);
			});
		}
	}, function(error, doc) {
		return func(null, _rtn);	//todo: 
	})
}

gameDao.update = function() {
	return null;
}