var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo-websocket');

// app configure
app.configure('production|development', function() {
	// route configures
	//app.route('chat', routeUtil.chat);
	//app.route('game', routeUtil.gameRoute);

	// filter configures
	app.filter(pomelo.timeout());
});

// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			//useDict : true,
			//useProtobuf : true
		});
	
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			//useProtobuf : true
		});
});

app.configure('production|development', 'connector|manager', function() {
	require('./app/dao/mongodb/mongodb').init(app, function(error, doc) {
		app.set('dbclient', doc);
	})
});

// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});
