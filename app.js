var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./lib/log.js')(module);
var mongoose = require('./lib/mongoose');
var HttpError = require('./error').HttpError;

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

app.use(express.favicon());

if (app.get('env') == 'development') {
  app.use(express.logger('dev'));
} else {
  app.use(express.logger('default'));
}

app.use(express.bodyParser());

app.use(express.cookieParser());

var sessionStore = require('./lib/sessionStore.js');

app.use(express.session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: sessionStore
}));

app.use(require('./middleware/sendHttpError.js'));
app.use(require('./middleware/loadUser.js'));

app.use(app.router);


require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      express.errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});


var server = http.createServer(app);
server.listen(config.get('port'), function(){
  console.log('Express server listening on port ' + config.get('port'));
});

var io = require('./socket')(server);
app.set('io', io);


// var server = http.createServer(app);
// server.listen(config.get('port'), function(){
//   log.info('Express server listening on port ' + config.get('port'));
// });

// var io = require('socket.io').listen(server);

// io.sockets.on('connection', function (socket) {

//   socket.on('message', function (text, cb) {
//     socket.broadcast.emit('message', text);
//     cb("123");
//   });
// });