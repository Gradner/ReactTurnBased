///////////////////////////////////////////////////////////////////
//  Imports
///////////////////////////////////////////////////////////////////

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var server = require('http').Server(app);
var io = require('socket.io')(server);

///////////////////////////////////////////////////////////////////
//  Initialization
///////////////////////////////////////////////////////////////////

var Game = require('./game/Game.js');
var User = require('./game/User.js');

server.listen(5999);
console.log('listening for sockets on port 5999')

///////////////////////////////////////////////////////////////////
//  Game Management
///////////////////////////////////////////////////////////////////

var gameIDcount = 0

var games = [];
var users = [];

///////////////////////////////////////////////////////////////////
//  Routes
///////////////////////////////////////////////////////////////////

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

///////////////////////////////////////////////////////////////////
//  Engine Setup
///////////////////////////////////////////////////////////////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

///////////////////////////////////////////////////////////////////
//  Socketbois
///////////////////////////////////////////////////////////////////

io.on('connection', function (socket) {
  
  ///////////////////////////////////////////////////////////////////
  //  Login/Reconcilliation
  ///////////////////////////////////////////////////////////////////

  console.log(socket.id)
  io.emit('userList', users);

  socket.on('login', (data)=>{
    var newUser = new User({
      username: data,
      socketID: socket.id
    })
    users.push(newUser)
    io.emit('userList', users);
  });

  socket.on('fetchGames', (data)=>{
    console.log('game list requested')
    socket.emit('gameList', games);
  });

  ///////////////////////////////////////////////////////////////////
  //  GameSelect
  ///////////////////////////////////////////////////////////////////

  socket.on('createGame', (data)=>{
    console.log('create new game requested')
    gameIDcount += 1;
    var newgame = new Game({
      gameID: gameIDcount.toString(),
      roomName: 'new created room ' + gameIDcount,
      socketUrl: '/game' + gameIDcount
    })
    games.push(newgame)
    socket.emit('gameList', games);
  });

  socket.on('joinGame', (gameid)=>{
    games[gameid].addPlayer(socket.id)
    io.emit('gameList', games);
  });

  ///////////////////////////////////////////////////////////////////
  //  Universal Disconnect
  ///////////////////////////////////////////////////////////////////

  socket.on('disconnect', ()=>{
    console.log('user disconnected')
    users = users.filter((user)=>{
      return user.socketID !== socket.id
    })
    io.emit('userList', users);
  })
});

// Final Export

module.exports = app;
