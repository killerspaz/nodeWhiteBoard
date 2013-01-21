
/**
 * Module dependencies.
 */

var express = require('express')
  , routing = require('./routes/routing')
  , http = require('http')
  , path = require('path');
var ioport = process.env.IO_PORT || 8080;

/**
 * Configure Express
 */

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/**
 * Setup Routes
 */

routing.route(app);

/**
 * Start Server
 */

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var socketIo = require('socket.io').listen(server);

socketIo.sockets.on('connection', function (socket) {
	socket.on('sendDraw', function (message) {
	    //console.log(message);
	    socket.broadcast.emit('updateDraw', message);
	});
	socket.on('sendChat', function (message) {
	    console.log(message);
	    socket.broadcast.emit('updateChat', message);
	});
});
