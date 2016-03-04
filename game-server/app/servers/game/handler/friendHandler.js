module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.getFriendList = function(msg, session, next) {
	return next(null, {code: 200, msg: 'friend'});
}

handler.friendApply = function() {
	return next(null, {code: 200, msg: 'friend'});
}

handler.friendDelete = function () {
	return next(null, {code: 200, msg: 'friend'});
}

handler.friendInspire = function () {
	return next(null, {code: 200, msg: 'friend'});
}

handler.friendInspires = function () {
	return next(null, {code: 200, msg: 'friend'});
}

handler.friendClaim = function () {
	return next(null, {code: 200, msg: 'friend'});
}

handler.frindClaims = function () {
	return next(null, {code: 200, msg: 'friend'});
}

handler.friendConfirm = function () {
	return next(null, {code: 200, msg: 'friend'});
}