var mongo = require('./mongodb/mongodb');


mongo.init({}, function(error, doc) {
	doc.game_user.findOne(function(error, doc) {
		console.log(error, doc);
	})
})
