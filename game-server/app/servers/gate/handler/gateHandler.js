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
	var uid = msg.uid;
	if(!uid) {
		return next(null, {code: 500});
	}
	// get all connectors
	var connectors = this.app.getServersByType('connector');
	if(!connectors || connectors.length === 0) {
		return next(null, {code: 500});
	}
	// select connector
	var res = dispatcher.dispatch(uid, connectors);
	return next(null, {code: 200, host: res.host, port: res.clientPort });
};