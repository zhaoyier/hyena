var teamManager = require('../../../service/teamManager');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.joinTeam = function(msg, session, next) {
	teamManager.applyJoinTeam({}, function(error, doc) {
		console.log('=====>>>1002:\t', error, doc);
		return next(null, {code: 200, msg: 'ok'});
	})
}