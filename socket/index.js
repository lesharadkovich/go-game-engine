var log = require('../lib/log')(module);
var async = require('async');
var config = require('../config');
var cookieParser = require('cookie-parser');
var sessionStore = require('../lib/sessionStore');
var HttpError = require('../error').HttpError;
var User = require('../models/user').User;

var Games = require('../games');

var Game = Games.Game;
var games = Games.games;



function loadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length == 0) {
            //no arguments => no session
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function loadUser(session, callback) {
    if (!session.user) {
        return callback(null, null);
    }

    User.findById(session.user, function (err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }

        callback(null, user);
    })
}


function getOnlineList(io, socket, username) {
    
    var onlineListId = Object.keys(io.sockets.sockets);
    var onlineListNames = [];
    
    for(var i = 0; i < onlineListId.length; i++) {
        var socketId = onlineListId[i];
        
        var _socket = io.sockets.connected[socketId];
        var _username = _socket.handshake.user.username;
        
        if (onlineListNames.indexOf(_username) === -1 && _username !== username) {
            onlineListNames.push(_username);
        }
    }
    
    
    socket.emit('online list', onlineListNames);
    //socket.broadcast.emit('online list', onlineListNames);

    return onlineListNames;
}

function sendInviteToEnemy(io, enemyName, username, game, creatorId) {
    var onlineListId = Object.keys(io.sockets.sockets);

    onlineListId.forEach(function (socketId) {
        var _socket = io.sockets.connected[socketId];
        var _username = _socket.handshake.user.username;


        if (_username == enemyName) {
            var enemyId = _socket.id;

            io.to(enemyId).emit('game invite', username, game.room, creatorId);
        }
    });
}

function cancelOtherInvites(io, username, socket) {
    var onlineListId = Object.keys(io.sockets.sockets);

    onlineListId.forEach(function (socketId) {
        var _socket = io.sockets.connected[socketId];
        var _username = _socket.handshake.user.username;


        if (_username == username && _socket.id != socket.id) {
            io.to(_socket.id).emit('cancel invite');
        }
    });
}


module.exports = function (server) {

    var secret = config.get('session:secret');
    var sessionKey = config.get('session:key');

    var io = require('socket.io').listen(server);

    var disconnectRoom = function (name) {
        name = '/' + name;

        var users = io.manager.rooms[name];

        for (var i = 0; i < users.length; i++) {
            io.sockets.socket(users[i]).disconnect();
        }

        return this;
    };

    // io.set('origins', 'http://localhost:*');
    io.set('logger', log);

    io.use(function (socket, next) {
        var handshakeData = socket.request;

        async.waterfall([
            function (callback) {
                //получить sid
                var parser = cookieParser(secret);
                parser(handshakeData, {}, function (err) {
                    if (err) return callback(err);

                    var sid = handshakeData.signedCookies[sessionKey];

                    loadSession(sid, callback);
                });
            },
            function (session, callback) {
                if (!session) {
                    return callback(new HttpError(401, "No session"));
                }

                socket.handshake.session = session;
                loadUser(session, callback);
            },
            function (user, callback) {
                if (!user) {
                    return callback(new HttpError(403, "Anonymous session may not connect"));
                }
                callback(null, user);
            }
        ], function (err, user) {

            if (err) {
                if (err instanceof HttpError) {
                    return next(new Error('not authorized'));
                }
                next(err);
            }

            socket.handshake.user = user;
            next();

        });

    });
    
    
    io.on('connection', function(socket) {        
        var username = socket.handshake.user.username;
        
        getOnlineList(io, socket, username);
        socket.broadcast.emit('join');
        
        
        socket.on('get online list', function () {   
            getOnlineList(io, socket, username);
        });
        
        socket.on('disconnect', function () {
            socket.broadcast.emit('leave', username);
        });

        //namespace: chat. Handles chat requests
        socket.on('message #chat', function (text, callback) {
            socket.broadcast.emit('message #chat', username, text);
            callback && callback();
        });
        
        
        //namespace: play. Handles play requests
        socket.on('message #game', function (text, callback) {
            socket.broadcast.emit('message #game', username, text);
            callback && callback();
        });
        
        socket.on('new challenge', function(enemyName, size) {
            //create game
            var creatorId = socket.id;

            var game = new Game(username, enemyName, size, creatorId);
            games.push(game);

            socket.emit('waiting', 'Ждем ответа от соперника', game.room);
            
            sendInviteToEnemy(io, enemyName, username, game, creatorId);
        });

        socket.on('new game with any player', function (size) {    
            var game = Games.isGameAvailible(size);

            if (game < 0) { //if game doesn't exist, create new one
                var game = new Game(username, 0, size, socket.id);
                games.push(game);

                socket.emit('waiting', 'Поиск подходящего противника', game.room);
            }
            else {  //if such game is availible
                game["white"].name = username;
                game["white"].id = socket.id;
                
                var creator = game["black"].id;

                socket.to(creator).emit('start game', username, game.room);
                socket.emit('start game', game["black"].name, game.room);
            }
        });

        //wait answer. if yes, join game room; if no, delete game
        socket.on('agreed', function (agreed, room, creatorId) {
            var gameIndex = Games.getGameIndex(room);

            if (agreed) {
                cancelOtherInvites(io, username, socket); 
                
                socket.to(creatorId).emit('start game', username, room);
                socket.emit('start game', games[gameIndex]["black"].name, room);
            }
            else {
                //emit client that user refused
                socket.to(creatorId).emit('refused', username);
                //delete game
                games.splice(gameIndex, 1);
                console.log(games);
            }
        });

        socket.on('cancel', function(room) {
            var gameIndex = Games.getGameIndex(room);
            //delete game
            games.splice(gameIndex, 1);

            console.log(games);
        });
    
    
        //namespace: game. Handles game requests
        socket.on('start', function(room) {
            var game = Games.getGameByRoom(room);
            
            if(game["black"].name === username) {
                game["black"].id = socket.id;     
            }
            else if(game["white"].name === username) {
                game["white"].id = socket.id;
            }
            
            socket.join(game.room);
            
            io.in(game.room).emit('drawBoard', game.board);
            game.changeInfoText(socket, username);
        });

        socket.on('move', function (mousePos, room) {
            var game = Games.getGameByRoom(room); //find room with username

            if (game < 0) return; //if no room with username, do nothing
            if (!game.isYourMove(username)) return;

            var addingCoords = game.stone.getPointCoords(game.board, mousePos);

            if (addingCoords && !game.board.isStoneExists(addingCoords)) {
                game.makeMove(addingCoords, io, socket);
            }
        });
    });



    return io;
};