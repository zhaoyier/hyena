var handler = module.exports;

var gOnlineUserObject = {};
var gOnlineNumber = 0;


handler.recordLongin = function(userId, callfunc) {
	if (!gOnlineUserObject[userId]) {
		gOnlineNumber += 1;
		gOnlineUserObject[userId] = 1;
	}

	return callfunc(null, true);
}

handler.removeLogin = function(userId, callfunc) {
	if (gOnlineUserObject[userId]) {
		delete gOnlineUserObject[userId];
		if (gOnlineNumber > 0) gOnlineNumber -= 1;
	}

	return callfunc(null);
}

handler.isUserOnline = function (userId, callfunc) {
	if (gOnlineUserObject[userId]) return callfunc(null, true);

	return callfunc(null, false);
}

handler.queryOnlineNumber = function(userId, callfunc) {
	return callfunc(null, gOnlineNumber);
}