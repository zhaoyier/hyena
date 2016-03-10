var async = require('async');
var pomelo = require('pomelo');


var utilFunc = require('../../../util/utilFunc');
var friendType = require('../../../config/consts').FriendType;


module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.getFriendList = function(msg, session, next) {
	pomelo.app.get('dbclient').game_friend_list.findOne({_id: session.get('userId')}, function(error, doc) {
		if (error) {
			return next(null, {code: 201, msg: error});
		} else {
			return next(null, {code: 200, data: doc.friends});
		}
	});	
}

handler.friendApply = function(msg, session, next) {
	async.series({
		checkApply: function(callback) {
			pomelo.app.get('dbclient').game_friend_apply.findOne({userId: session.get('userId'), friend: msg.friendId}, function(error, doc) {
				if (error) return callback(error);

				if (!doc) return callback('had been apply');

				return callback(null);
			})
		},
		checkFriend: function(callback) {
			pomelo.app.get('dbclient').game_friend_list.findOne({_id: session.get('userId'), 'friends._id': msg.friendId}, function(error, doc) {
				if (error) return callback(error);

				if (!doc) return callback('has been friend');

				return callback(null);
			})
		},
		applyFriend: function(callback) {
			pomelo.app.get('dbclient').game_friend_apply.save({userId: session.get('userId'), friend: msg.friendId, ct: Date.now()/1000|0}, function(error, doc) {
				if (error) return callback(error);

				return callback(null);
			})
		},
		sendMsg: function(callback) {
			var _message = {userId: session.get('userId'), friendId: msg.friendId, ct: Date.now()/1000|0, type: friendType.Apply, status: 0};
			pomelo.app.get('dbclient').game_friend_event.insert(_message, function(error, doc) {
				if (error) return callback(error);

				return callback(null);
			})
		}
	}, function(error, doc) {
		if (error) {
			return next(null, {code: 200, msg: 'friend'});
		} else {
			return next(null, {code: 200, msg: 'friend'});
		}
	})
	
}

handler.friendDelete = function (msg, session, next) {
	async.series({
		checkFriend: function(callback) {
			pomelo.app.get('dbclient').game_friend_list.findOne({_id: session.get('userId'), 'friends._id': msg.friendId}, function(error, doc) {
				if (error) return callback(error);

				if (!doc) return callback('not friend');

				return callback(null);
			})
		},
		deleteFriend: function(callback) {
			pomelo.app.get('dbclient').game_friend_list.update({_id: session.get('userId')}, {$pull: {'friends._id': msg.friendId}}, {w:1}, function(error, doc) {
				if (error) return callback(error);

				return callback(null);
			})
		},
		sendMsg: function(callback) {
			var _message = {userId: session.get('userId'), friendId: msg.friendId, ct: Date.now()/1000|0, type: friendType.Delete, status: 0};
			pomelo.app.get('dbclient').game_friend_event.insert(_message, function(error, doc) {
				if (error) return callback(error);

				return callback(null);
			})
		}
	}, function(error, doc) {
		if (error) {
			return next(null, {code: 201, msg: error});
		} else {
			return next(null, {code: 200, msg: 'ok'});
		}
	})
}

handler.friendInspire = function (msg, session, next) {
	var _friendObj = null;
	var _today = utilFunc.getTodayDate();

	async.series({
		checkFriend: function(callback) {
			pomelo.app.get('dbclient').game_friend_list.findOne({_id: session.get('userId')}, function(error, doc) {
				if (error) return callback(null);

				if (!doc) return callback('friend empty');

				for (var i in doc.friends) {
					if (doc.friends[i]._id == msg.friendId) _friendObj = doc.friends[i];
				}

				return callback(null);
			})
		},
		inspireFriend: function(callback) {
			if (!_friendObj) return callback('error friend id or not friend');

			if (!_friendObj.d || _friendObj.d >= _today) return callback('has inspire');

			pomelo.app.get('dbclient').game_friend_list.update({_id: session.get('userId'), 'friends._id': msg.friendId}, {$set: {'friends.$.d': _today}}, {w: 1}, function(error, doc) {
				if (error) return callback(error);

				return callback(null);
			})
		},
		sendMsg: function(callback) {
			var _message = {userId: session.get('userId'), friendId: msg.friendId, ct: Date.now()/1000|0, type: friendType.Inspire, status: 0};
			pomelo.app.get('dbclient').game_friend_event.insert(_message, function(error, doc) {
				if (error) return callback(error);

				return callback(null);
			})
		}
	}, function(error, doc) {
		if (error) {
			return next(null, {code: 201, msg: error});
		} else {
			return next(null, {code: 200, msg: 'ok'});
		}
	})
}

handler.friendOnekeyInspire = function (msg, session, next) {
	var _inspireFriend = [], _allFriend = [];
	var _today = utilFunc.getTodayDate();

	async.series({
		queryFriend: function(callback) {
			pomelo.app.get('dbclient').game_friend_list.findOne({_id: session.get('userId')}, function(error, doc) {
				if (error) return callback(error);

				if (!doc || !doc.friends) return callback('error user id or no friend');

				_allFriend = doc.friends;

				for (var i in doc.friends) {
					if (doc.friends[i].d < _today) _inspireFriend.push(doc.friends[i]);
				}

				return callback(null);
			})
		},
		inspireFriend: function(callback) {
			if (_inspireFriend.length == 0) return callback('no inpire friend');

			for (var i in _allFriend) {
				if (_allFriend[i].d < _today) _allFriend[i].d = _today;
			}

			pomelo.app.get('dbclient').game_friend_list.update({_id: session.get('userId')}, {$set: {friends: _allFriend}}, {w: 1}, callback);
		},
		sendMsg: function(callback) {
			async.eachSeries(_inspireFriend, function(elem, callfunc) {
				var _message = {userId: session.get('userId'), friendId: elem._id, ct: Date.now()/1000|0, type: friendType.Inspire};
				pomelo.app.get('dbclient').game_friend_event.insert(_message, function(error, doc) {
					if (error) return callfunc(error);

					return callfunc(null);
				});
			}, callback);
		}
	}, function(error, doc) {
		if (error) {
			return next(null, {code: 201, msg: error});
		} else {
			return next(null, {code: 200, msg: 'ok'});
		}
	})
}

handler.friendClaim = function (msg, session, next) {
	async.series({
		queryEvent: function(callback) {
			pomelo.app.get('dbclient').game_friend_event.findOne({_id: session.get('userId'), friendId: msg.friendId}, function(error, doc) {
				if (error) return callback(error);

				return callback(null);
			})
		},
		sendReward: function(callback) {
			return callback(null);
		}
	}, function(error, doc) {
		if (error) {
			return next(null, {code: 201, msg: error});
		} else {
			return next(null, {code: 200, msg: 'ok'});
		}
	})
}

handler.frindOnekeyClaim = function (msg, session, next) {
	var _temp = [];

	async.series({
		queryEvent: function(callback) {
			pomelo.app.get('dbclient').game_friend_event.find({_id: session.get('userId')}).toArray(function(error, doc) {
				if (error) return callback(error);

				if (!doc) return callback(null);

				for (var i in doc) {

				}

				return callback(null);
			})
		},
		sendReward: function(callback) {
			async.eachSeries(_temp, function(elem, callfunc) {
				return callfunc(null);
			}, function(error, doc) {
				return callback(null);
			})
		}
	}, function(error, doc){
		if (error) {
			return next(null, {code: 201, msg: error});
		} else {
			return next(null, {code: 200, msg: 'ok'});
		}
	})
}

handler.friendConfirm = function (msg, session, next) {
	return next(null, {code: 200, msg: 'friend'});
}