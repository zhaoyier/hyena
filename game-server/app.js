var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var ChatService = require('./app/services/chatService');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'hyena');

// app configure
app.configure('production|development', function() {
    // route configures
    app.route('connector', routeUtil.connector);

    // filter configures
    app.filter(pomelo.timeout());
});

// Configure database
app.configure('production|development', 'area|auth|connector|master', function() {
    //var dbclient = require('./app/dao/mysql/mysql').init(app);
    //app.set('dbclient', dbclient);
    //app.load(pomelo.sync, {path:__dirname + '/app/dao/mapping', dbclient: dbclient});
    //app.use(sync, {sync: {path:__dirname + '/app/dao/mapping', dbclient: dbclient}});
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

// Configure for chat server
app.configure('production|development', 'chat', function() {
    app.set('chatService', new ChatService(app));
});

// start app
app.start();

process.on('uncaughtException', function(err) {
    console.error(' Caught exception: ' + err.stack);
});
