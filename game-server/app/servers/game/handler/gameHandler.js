var teamManager = require('../../../service/teamManager');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.joinTeam = function(msg, session, next) {
	teamManager.applyJoinTeam(msg, function(error, doc) {
		return next(null, {code: 200, msg: 'ok'});
	})
}

handler.changeTeam = function(msg, session, next) {

}

handler.processTeam = function (msg, session, next) {
	var _gameCode = msg.gameCode;
	if (_gameCode == 1) {

	} else if (_gameCode == 2) {

	} else {

	}
}

handler.exitTeam = function(msg, session, next) {

}

handler.clearGame = function (msg, session, next) {

}