var exp = module.exports;

exp.getUserCardType = function(data) {
	return 2;
}

exp.concatJson = function(json, obj) {
	for (var i in obj) {
		if (!json[i]) {
			json[i] = obj[i];
			return json;
		} else {
			return null;
		}
	}
}