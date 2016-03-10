module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.getRechargeList = function (msg, session, next) {
	return next(null, {code: 200, msg: 'helloword'});
}

handler.gameRecharge = function (msg, session, next) {
	return next(null, {code: 200, msg: 'helloword'});
}