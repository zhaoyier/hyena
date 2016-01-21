var arg = process.argv.slice(2);


main();

function main() {
	var temp = [5,7,9,11];
	var _rtn = next(temp, parseInt(arg[0]));
	console.log('====>>:\t', arg[0], _rtn);
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
