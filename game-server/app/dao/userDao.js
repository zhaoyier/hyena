var utils = require('../util/utils');

var handler = module.exports;


handler.login = function (username, password) {

}

handler.queryMatchRecord = function(userId, cb) {
	utils.invokeCallback(cb, null, {cardType: 1});
}