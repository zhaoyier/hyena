var async = require('async');

var handle = module.exports;

handle.concatJson = function(json, obj) {
	for (var i in obj) {
		if (!json[i]) {
			json[i] = obj[i];
			return json;
		} else {
			return null;
		}
	}
}

handle.getUserWeightScore = function(fight, userVip){
	//var _config = [{}]
	return 300;
}

handle.getUserCardType = function(userScore) {
	var _config = [{score: 100, type: [{i: 3, r: 100}]}, {score: 2000, type: [{i:1, r: 40}, {i: 2, r: 60}]}, {score: 200000, type: [{i: 1, r: 20}, {i: 2, r: 40}, {i: 3, r: 40}]}];

	for (var i in _config) {
		if (userScore <= _config[i].score) return randomizeRateWeight(_config[i].type);
	}

	return 1;
}

handle.randomizeRateWeight = function (config) {
	var _totalRate = 0, _addRate = 0;
	for (var i in config) { _totalRate += config[i].r; }

	var _randomRate = Math.random()*_totalRate|0;

	for (var i in config) {
		_addRate += config[i].r;
		if (_randomRate > _addRate) return config[i].i;
	}

	return 1;
}

handle.getUserBetType = function(cardState, amount) {
	return 1;
}