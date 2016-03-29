var dispatcher = require('../../../util/dispatcher');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.queryEntry = function(msg, session, next) {
	var _connectors = this.app.getServersByType('connector');

	if (!_connectors || _connectors.length === 0) {
		return next(null, {code: 500});
	}

	var _connector = dispatcher.randomDispatch(_connectors);
	return next(null, {code: 200, host: _connector.host, port: _connector.clientPort, serverId: _connector.id});
};
