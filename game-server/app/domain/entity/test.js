var async = require('async');
var card_service = require('./card');

var service = new card_service();

var doc = service.initUserHand(3);

if (doc && doc.length == 3) {
        console.log('*****************: ', doc, ' :*****************');
        console.log('color:', doc[0]/CARD_SCALE|0, '\t', doc[1]/CARD_SCALE|0, '\t', doc[2]/CARD_SCALE|0, '\nvalue:', doc[0]%CARD_SCALE|0, '\t', doc[1]%CARD_SCALE|0, '\t', doc[2]%CARD_SCALE|0);
        console.log('******************************************************');
}