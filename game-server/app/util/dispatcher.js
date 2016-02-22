var crc = require('crc');

module.exports.dispatch = function(uid, connectors) {
	var index = Math.abs(crc.crc32(uid)) % connectors.length;
	return connectors[index];
};

module.exports.randomDispatch = function(connectors) {
	var _randomIndex = parseInt(Math.random()*connectors.length);

	return connectors[_randomIndex];
}