var async = require('async');

//var utilFunc = require('./UtilityFunction');

module.exports = Card;

CARD_SCALE = 16;

function Card() {
	this.colorNum = 4;
	this.cardColor = {HEART:1, SPADE: 2, CLUB: 3, DIAMOND: 4};
	this.cardType = {DAN: 1, DUI: 2, SHUN: 3, JIN: 4, SJ: 5, ZD: 6};
	this.cardHash = {1: [0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,0x1E], 
		2: [0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,0x2E], 
		3: [0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,0x3E], 
		4: [0x42,0x43,0x44,0x45,0x46,0x47,0x48,0x49,0x4A,0x4B,0x4C,0x4D,0x4E]};
}

Card.prototype.initCardAsRandom = function() {
	
}

Card.prototype.initCardAsWeight = function() {

}

/**
* function: 初始化卡牌
* */
Card.prototype.initUserHand = function(cardType) {
	var _cardColor, _selectCardList = [], _self = this, cardType = parseInt(cardType);
	if (cardType < 1 || cardType > 6) return nulll;

	if (cardType == 1 || cardType == 2 || cardType == 3) {
		if ((Math.random()*2|0) == 0) {
			_cardColor = _self.selectTwoColor();
		} else {
			_cardColor = _self.selectThreeColor();
		}
	} else if (cardType == 4 || cardType == 5) {
		_cardColor = this.selectOneColor();
	} else {
		_cardColor = this.selectThreeColor();
	}

	while (true) {
		for (var i in _cardColor) {
			selectNonexistenceCard(_self, _selectCardList, _cardColor[i], cardType);
		}

		if (_selectCardList && _selectCardList.length == 3) break;
	}

	return _selectCardList;
}

//选择一种花色
Card.prototype.selectOneColor = function() {
	var _random = (Math.random()*this.colorNum|0)+1;
	return [_random, _random, _random]
}
//选择两种花色
Card.prototype.selectTwoColor = function() {
	while (true) {
		var _random1 = parseInt((Math.random()*this.colorNum|0)+1);
		var _random2 = parseInt((Math.random()*this.colorNum|0)+1);
		if (_random1 != _random2 && (Math.random()*2|0) == 0) {
			return [_random1, _random1, _random2];
		}
		if (_random1 != _random2 && (Math.random()*2|0) == 1) {
			return [_random1, _random2, _random2];
		}
	}
}
//选择三种花色
Card.prototype.selectThreeColor = function() {
	var _tempColor = [1, 2, 3, 4];
	_tempColor.splice((Math.random()*this.colorNum|0), 1);
	return _tempColor;
}

var selectOneCard = function(service, cardColor) {
	if (cardColor < service.cardColor.HEART || cardColor > service.cardColor.DIAMOND) return null;

	if (service.cardHash[cardColor].length == 0) return null;

	if (cardColor == service.cardColor.HEART) {
		return service.cardHash[service.cardColor.HEART].splice(Math.random()*service.cardHash[service.cardColor.HEART].length|0, 1)[0];
	} else if (cardColor == service.cardColor.SPADE) {
		return service.cardHash[service.cardColor.SPADE].splice(Math.random()*service.cardHash[service.cardColor.SPADE].length|0, 1)[0];
	} else if (cardColor == service.cardColor.CLUB) {
		return service.cardHash[service.cardColor.CLUB].splice(Math.random()*service.cardHash[service.cardColor.CLUB].length|0, 1)[0];
	} else {
		return service.cardHash[service.cardColor.DIAMOND].splice(Math.random()*service.cardHash[service.cardColor.DIAMOND].length|0, 1)[0];
	}
}

var checkDanpaiSizeExist = function(cardList, card) {
	if (!cardList || cardList.length == 0) return true;

	if (cardList.length == 1) {
		if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) >= 1) return true;		
	}

	if (cardList.length == 2) {
		if (Math.abs(getCardSize(cardList[0]) - getCardSize(cardList[1])) == 1) {
			if (getCardSize(cardList[0]) > getCardSize(cardList[1])) {
				if (Math.abs(getCardSize(card) - getCardSize(cardList[1])) >= 3) return true;
			} else {
				if (Math.abs(getCardSize(card) - getCardSize(cardList[0])) >= 3) return true;
			}
		} else if (Math.abs(getCardSize(cardList[0]) - getCardSize(cardList[1])) == 2) {
			if (getCardSize(cardList[0]) < getCardSize(cardList[1])) {
				if (getCardSize(card) < getCardSize(cardList[0]) || getCardSize(card) > getCardSize(cardList[1])) return true;
			} else {
				if (getCardSize(card) > getCardSize(cardList[0]) || getCardSize(card) < getCardSize(cardList[1])) return true;
			}			
		} else {
			if (getCardSize(card) != getCardSize(cardList[0]) && getCardSize(card) != getCardSize(cardList[1])) return true;
		}
	}

	return false;
}

var checkDuiziSizeExist = function(cardList, card, dif) {
	if (!cardList || cardList.length == 0) return true;

	if (cardList.length == 1) {
		if (getCardColor(cardList[0]) == getCardColor(card)) {
			if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) >= 1) return true;
		} else {
			if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) >= 0) return true;
		}				
	}

	if (cardList.length == 2) {
		if (getCardSize(cardList[0]) == getCardSize(cardList[1])) {
			if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) != 0) return true;
		} else {
			if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) == 0 || Math.abs(getCardSize(cardList[1]) - getCardSize(card)) == 0 ) return true;
		}
	}

	return false;
}

var checkShunziSizeExist = function(cardList, card, dif) {
	if (!cardList || cardList.length == 0) return true;

	if (cardList.length == 1) {
		if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) == 1) return true;
	}

	if (cardList.length == 2) {
		if (getCardSize(cardList[0]) > getCardSize(cardList[1])) {
			if ((getCardSize(card) - getCardSize(cardList[0]) == 1) || (getCardSize(cardList[1]) - getCardSize(card) == 1))	return true;		
		} else {
			if ((getCardSize(card) - getCardSize(cardList[1]) == 1) || (getCardSize(cardList[0]) - getCardSize(card) == 1))	return true;
		}
	}

	return false;
}

var checkJinhuaSizeExist = function(cardList, card, dif) {
	if (!cardList || cardList.length == 0) return true;

	if (cardList.length == 1) {
		if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) >= 1) return true;
	}

	if (cardList.length == 2) {
		if (Math.abs(getCardSize(cardList[0]) - getCardSize(cardList[1])) == 1) {
			if (getCardSize(cardList[0]) > getCardSize(cardList[1])) {
				if (Math.abs(getCardSize(card) - getCardSize(cardList[1])) >= 3) return true;
			} else {
				if (Math.abs(getCardSize(card) - getCardSize(cardList[0])) >= 3) return true;
			}
		} else if (Math.abs(getCardSize(cardList[0]) - getCardSize(cardList[1])) == 2) {
			if (getCardSize(cardList[0]) < getCardSize(cardList[1])) {
				if (getCardSize(card) < getCardSize(cardList[0]) || getCardSize(card) > getCardSize(cardList[1])) return true;
			} else {
				if (getCardSize(card) > getCardSize(cardList[0]) || getCardSize(card) < getCardSize(cardList[1])) return true;
			}
		} else {
			return true;
		}
	}
	return false;
}
var checkShunjinSizeExist = function(cardList, card, dif) {
	if (!cardList || cardList.length == 0) return true;

	if (cardList.length == 1) {
		if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) == 1) return true;
	}

	if (cardList.length == 2) {
		if (getCardSize(cardList[0]) > getCardSize(cardList[1])) {
			if ((getCardSize(card) - getCardSize(cardList[0]) == 1) || (getCardSize(cardList[1]) - getCardSize(card) == 1))	return true;		
		} else {
			if ((getCardSize(card) - getCardSize(cardList[1]) == 1) || (getCardSize(cardList[0]) - getCardSize(card) == 1))	return true;
		}
	}
	return false;
}
var checkZhadanSizeExist = function(cardList, card, dif) {
	if (!cardList || cardList.length == 0) return true;

	if (cardList.length == 1) {
		if (Math.abs(getCardSize(cardList[0]) - getCardSize(card)) == 0) return true;
	}

	if (cardList.length == 2) {
		if (getCardSize(card) - getCardSize(cardList[0]) == 0) return true;
	}

	return false;
}
var selectNonexistenceCard = function(service, cardList, cardColor, type) {
	while (true) {
		var _temp = selectOneCard(service, cardColor);

		if (_temp != null && type == 1) {
			console.log('=======>>>201:\t', cardColor, type, _temp);
			if (checkDanpaiSizeExist(cardList, _temp)) {
				cardList.push(_temp); break ;
			}
		} else if (_temp != null && type == 2) {
			console.log('=======>>>202:\t', cardColor, type, _temp);
			if (checkDuiziSizeExist(cardList, _temp)) {
				cardList.push(_temp); break ;
			}
		} else if (_temp != null && type == 3) {
			console.log('=======>>>203:\t', cardColor, type, _temp);
			if (checkShunziSizeExist(cardList, _temp)) {
				cardList.push(_temp); break ;
			}
		} else if (_temp != null && type == 4) {
			console.log('=======>>>204:\t', cardColor, type, _temp);
			if (checkJinhuaSizeExist(cardList, _temp)) {
				cardList.push(_temp); break ;
			}
		} else if (_temp != null && type == 5) {
			console.log('=======>>>205:\t', cardColor, type, _temp);
			if (checkShunjinSizeExist(cardList, _temp)) {
				cardList.push(_temp); break ;
			}
		} else if (_temp != null && type == 6) {
			console.log('=======>>>206:\t', cardColor, type, _temp);
			if (checkZhadanSizeExist(cardList, _temp)) {
				cardList.push(_temp); break ;
			}
		} else {
			break;
		}
	}
}

/**
* function: 
* 
* */
var getCardColor = function(card) {
	if (!card) return -1;
	return card/CARD_SCALE|0;
}
/**
* function: 值
* 
* */
var getCardSize = function(card) {
	if (!card) return -1;
	return card%CARD_SCALE|0;
}

/**
*
* */
var isExist = function(list, card) {
	if (!list || !Array.isArray(list) || !card) return false;

	for (var i in list) {
		if (list[i] == card) return true;
	}

	return false;
}

/**
* function: 
* 
* */
// CardService.prototype.initDanpaiHand = function(cb) {
// 	var _cardColor, _selectCardList = [], _self = this;
// 	if ((Math.random()*2|0) == 0) {
// 		_cardColor = _self.selectTwoColor();
// 	} else {
// 		_cardColor = _self.selectThreeColor();
// 	}

// 	async.eachSeries(_cardColor, function(elem, callback) {
// 		selectNonexistenceCard(_self, _selectCardList, elem, _self.cardType.DAN);
// 		return callback(null);
// 	}, function(error) {
// 		return  cb(null, _selectCardList);
// 	})
// }

// CardService.prototype.initDuiziHand = function(cb) {
// 	var _cardColor, _selectCardList = [], _self = this;
// 	if ((Math.random()*2|0) == 0) {
// 		_cardColor = _self.selectTwoColor();
// 	} else {
// 		_cardColor = _self.selectThreeColor();
// 	}

// 	async.eachSeries(_cardColor, function(elem, callback) {
// 		selectNonexistenceCard(_self, _selectCardList, elem, _self.cardType.DUI);
// 		return callback(null);
// 	}, function(error) {
// 		return  cb(null, _selectCardList);
// 	})
// }

// CardService.prototype.initShunziHand = function(cb) {
// 	var _cardColor, _selectCardList = [], _self = this;
// 	if ((Math.random()*2|0) == 0) {
// 		_cardColor = _self.selectTwoColor();
// 	} else {
// 		_cardColor = _self.selectThreeColor();
// 	}

// 	async.eachSeries(_cardColor, function(elem, callback) {
// 		selectNonexistenceCard(_self, _selectCardList, elem, _self.cardType.SHUN);
// 		return callback(null);
// 	}, function(error) {
// 		return  cb(null, _selectCardList);
// 	})
// }

// CardService.prototype.initJinhuaHand = function(cb) {
// 	var _cardColor = this.selectOneColor(), _selectCardList = [], _self = this;

// 	async.eachSeries(_cardColor, function(elem, callback) {
// 		selectNonexistenceCard(_self, _selectCardList, elem, _self.cardType.JIN);
// 		return callback(null);
// 	}, function(error) {
// 		return  cb(null, _selectCardList);
// 	})
// }

// CardService.prototype.initShunjinHand = function() {
// 	var _cardColor = this.selectOneColor(), _selectCardList = [], _self = this;
	
// 	async.eachSeries(_cardColor, function(elem, callback) {
// 		selectNonexistenceCard(_self, _selectCardList, elem, _self.cardType.SJ);
// 		return callback(null);
// 	}, function(error) {
// 		return  cb(null, _selectCardList);
// 	})
// }

// CardService.prototype.initZhadanHand = function() {
// 	var _cardColor = this.selectThreeColor(), _selectCardList = [], _self = this;
	
// 	async.eachSeries(_cardColor, function(elem, callback) {
// 		selectNonexistenceCard(_self, _selectCardList, elem, _self.cardType.ZD);
// 		return callback(null);
// 	}, function(error) {
// 		return  cb(null, _selectCardList);
// 	})
// }


