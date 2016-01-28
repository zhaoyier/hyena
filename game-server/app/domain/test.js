var temp = require('./entity/Temp').User;
var arg = process.argv.slice(2);


main();

function main() {
	var user = new temp({username: 'admin', userId: 1});
	console.log('=====>>:\t', user);

}

function next(temp, value) {
	var tail = temp.slice(-1);
	if (tail == value) {
		return temp[0];
	} else {
		for (var i in temp) {
			console.log('====>>001:\t', temp, temp[i], value);
			if (temp[i] == value) {
				var index = parseInt(i)+1;
				console.log('====>>002:\t', typeof(i), index, temp[2]);
				return temp[index];
			}
		}
	}
}
