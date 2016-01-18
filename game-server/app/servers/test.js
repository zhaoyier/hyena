var gameHandler = require('./game/handler/gameHandler');

var temp = new gameHandler({});
temp.joinTeam({}, {}, function(error, doc) {
	console.log('====>>>002:\t', error, doc);
})
