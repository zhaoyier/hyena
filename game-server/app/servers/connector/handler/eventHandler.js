module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.getNoticeEvent = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getFriendEvent = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getExchangeEvent = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getMatchEvent = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getTaskEvent = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getSigninEvent = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getSigninList = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.claimSignin = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getExchangeList = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.claimExchange = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getMatchInfo = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.getTaskList = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}

handler.claimTask = function (msg, session, next) {
	return next(null, {code: 200, msg: 'hello world!'});
}