var async = require('async');
var MongoClient = require('mongodb').MongoClient;

var sqlclient = module.exports;

sqlclient.init = function(app, cb) {
	var collections = {};
	var url = 'mongodb://'+'10.96.36.181'+':'+'27017'+'/'+'hyena';
	async.series({
		game_db: function(callback) {
			getGameDBCollections(url, collections, function(error, doc) {
				return callback(error);
			})
		}
	}, function(error, doc) {
		if (error) {
			return cb(error, null);
		} else {
			return cb(error, collections);
		}
	});
}

function getGameDBCollections(url, collections, cb) {
	MongoClient.connect(url, function(error, db) {
		game_user: function(callback) {
			db.collection('game_user', function(error, coll){
				if (!error) collections.game_user = coll;

				return callback(null);
			})
		}
	}, function(error, doc) {
		return cb(null);
	})
}
