var exp = module.exports;
var dispatcher = require('./dispatcher');

exp.chat = function(session, msg, app, cb) {
	var chatServers = app.getServersByType('chat');

	if(!chatServers || chatServers.length === 0) {
		cb(new Error('can not find chat servers.'));
		return;
	}

	var res = dispatcher.dispatch(session.get('rid'), chatServers);

	cb(null, res.id);
};

exp.gameRoute = function(session, msg, app, cb){
    var gameServers = app.getServersByType('game');
    if (!gameServers || gameServers.length === 0) {
        cb(new Error('can not find game servers'));
        return ;
    }
    var uid = session.get('playerId');
    var res = dispatcher.dispatch(parseInt(uid), gameServers);
    cb(null, res.id);
 }