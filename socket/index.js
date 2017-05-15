var log = require('../lib/log')(module);
var async = require('async');
var config = require('../config');
var cookieParser = require('cookie-parser');
var sessionStore = require('../lib/sessionStore');
var HttpError = require('../error').HttpError;
var User = require('../models/user').User;


var Board = require('../board');
var Stone = require('../stone');
var Rules = require('../rules');



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

function getOnlineList(io, socket) {
    var onlineListId = Object.keys(io.sockets.sockets);
    var onlineListNames = [];

    onlineListId.forEach(function (socketId) {
        var _socket = io.sockets.connected[socketId];
        var _username = _socket.handshake.user.username;

        if (onlineListNames.indexOf(_username) === -1) {
            onlineListNames.push(_username);
        }
    });

    return onlineListNames;
}

function getIdByUsername(io, enemyName) {
    var onlineListId = Object.keys(io.sockets.sockets);
    var enemyId;

    onlineListId.forEach(function (socketId) {
        var _socket = io.sockets.connected[socketId];
        var username = _socket.handshake.user.username;


        if (username == enemyName) {
            enemyId = _socket.id;
        }
    });

    return enemyId;
}

function uuid() {
    var s4 = function () {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

function createGame(username, enemyName, size) {
    var width = 700;
    var board = new Board(width, size);
    var stone = new Stone(board);
    var rules = new Rules();

    return {
        room: uuid(),
        "black": username,
        "white": enemyName,
        size: size,
        board: board,
        rules: rules,
        stone: stone,
        stonePlaces: size * size,
        score: {
            "black": 0,
            "white": 0
        }
    };
}

function getGameIndex(room) {
    var index = -1;
    
    games.forEach(function (game, i, games) {
        if (game.room === room) {
            index = i;
            return;
        }
    });

    return index;
}

function isGameAvailible(size) {
    var index = -1;

    games.forEach(function (game, i, games) {
        if ((size === game.size) && game["white"] == 0) {
            index = i;
            return;
        }
    });

    return index;
}

function isYourMove(username, gameIndex) {
    var currentMove = games[gameIndex].rules.currentPlayerColor;

    if (username === games[gameIndex][currentMove]) return true;
    else return false;
}

function makeMove(addingCoords, gameIndex, io, socket) {

    //draw stone
    io.in(games[gameIndex].room).emit('drawStone', addingCoords, games[gameIndex].stone,
        games[gameIndex].board, games[gameIndex].rules);

    //add coords to array
    var indexOfCluster = games[gameIndex].rules.addCoords(games[gameIndex].board, addingCoords);
    //find surrounded coords
    var surroundedCoords = games[gameIndex].rules.checkClosure(games[gameIndex].board, indexOfCluster);
    //delete coords

    //delete stones
    io.in(games[gameIndex].room).emit('deleteStones', surroundedCoords, games[gameIndex].rules,
        games[gameIndex].board, games[gameIndex].stone);

    var yourColor = games[gameIndex].rules.currentPlayerColor;
    var enemyColor = games[gameIndex].rules.color[yourColor];

    games[gameIndex].score[yourColor] += surroundedCoords.length;

    changeInfoText(gameIndex, socket);


    games[gameIndex].board.previousStone = addingCoords;
    games[gameIndex].rules.switchPlayer();

    games[gameIndex].stonePlaces--;
    if (games[gameIndex].stonePlaces == 0) {
        //win or lose

        if (games[gameIndex].score["black"] > games[gameIndex].score["white"]) {
            var winId = getIdByUsername(io, games[gameIndex]["black"]);
            var loseId = getIdByUsername(io, games[gameIndex]["white"]);
        }
        else if (games[gameIndex].score["black"] < games[gameIndex].score["white"]) {
            var winId = getIdByUsername(io, games[gameIndex]["white"]);
            var loseId = getIdByUsername(io, games[gameIndex]["black"]);
        }

        //game over
        gameOver(io, winId, loseId);
        //delete game
        games.splice(gameIndex, 1);
    }
}

function gameOver(io, winId, loseId) {
    var winSocket = io.sockets.connected[winId];
    var loseSocket = io.sockets.connected[loseId];

    //save to DB
    winSocket.handshake.user.wins++;
    winSocket.handshake.user.save();

    loseSocket.handshake.user.loses++;
    loseSocket.handshake.user.save();

    io.to(winId).emit('game over', 'Вы выиграли!');
    io.to(loseId).emit('game over', 'Вы проиграли!');
}

function startGame(gameIndex, username, io, socket) {
    socket.broadcast.to(games[gameIndex].room).emit('start game', username, games[gameIndex].room);
    socket.emit('start game', games[gameIndex]["black"], games[gameIndex].room);

    io.in(games[gameIndex].room).emit('drawBoard', games[gameIndex].board);
}

function changeInfoText(gameIndex, socket) {
    var yourColor = games[gameIndex].rules.currentPlayerColor;
    var enemyColor = games[gameIndex].rules.color[yourColor];

    socket.broadcast.to(games[gameIndex].room).emit('change info text', true, games[gameIndex].score[enemyColor], games[gameIndex].score[yourColor]);
    socket.emit('change info text', false, games[gameIndex].score[yourColor], games[gameIndex].score[enemyColor]);
}


var games = []; //stores info about active games: roomId, players, etc


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

    io.set('origins', 'http://localhost:*');
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


    io.on('connection', function (socket) {
        var username = socket.handshake.user.username;

        var onlineListNames = getOnlineList(io, socket);
        socket.emit('online list', onlineListNames);
        socket.broadcast.emit('join', username, onlineListNames);


        socket.on('disconnect', function () {
            socket.broadcast.emit('leave', username);
        });

        //namespace: chat. Handles chat requests
        socket.on('message #chat', function (text, callback) {
            socket.broadcast.emit('message #chat', username, text);
            callback && callback();
        });



        //namespace: play. Handles play requests

        socket.on('message #play', function (text, callback) {
            socket.broadcast.emit('message', username, text);
            callback && callback();
        });
        
        socket.on('new challenge', function(enemyName, size) {
            //create game
            games.push(createGame(username, enemyName, size));

            var gameIndex = games.length - 1;

            //find his id
            var enemyId = getIdByUsername(io, enemyName);

            //send request
            socket.to(enemyId).emit('game invite', username, games[gameIndex].room);
        });

        socket.on('new game with any player', function (size) {    
            var gameIndex = isGameAvailible(size);

            if (gameIndex >= 0) {  //if such game is availible
                games[gameIndex]["white"] = username;
                var creator = getIdByUsername(io, games[gameIndex]["black"]);

                socket.to(creator).emit('start game', username, games[gameIndex].room);
                socket.emit('start game', games[gameIndex]["black"], games[gameIndex].room);
            }
            else { //if not, create new game
                games.push(createGame(username, 0, size));
                var gameIndex = games.length - 1;

                socket.emit('searching');
            }
        });

        //wait answer. if yes, join game room; if no, delete game
        socket.on('agreed', function (agreed, room) {
            var gameIndex = getGameIndex(room);
            var creator = getIdByUsername(io, games[gameIndex]["black"]);

            if (agreed) {
                socket.to(creator).emit('start game', username, room);
                socket.emit('start game', games[gameIndex]["black"], room);
            }
            else {
                //emit client that user refused
                socket.to(creator).emit('refused', username);
                //delete game
                games.splice(gameIndex, 1);
            }
        });
        
        
        
        
        socket.on('start', function(room) {
            console.log('start');
            var gameIndex = getGameIndex(room);
            
            socket.join(games[gameIndex].room);
            
            startGame(gameIndex, username, io, socket);
            changeInfoText(gameIndex, socket);
        });

        socket.on('move', function (mousePos, room) {
            var gameIndex = getGameIndex(room); //find room with username
            if (gameIndex < 0) return; //if no room with username, do nothing
            if (!isYourMove(username, gameIndex)) return;

            var addingCoords = games[gameIndex].stone.getPointCoords(games[gameIndex].board, mousePos);

            if (addingCoords && !games[gameIndex].board.isStoneExists(addingCoords)) {
                makeMove(addingCoords, gameIndex, io, socket);
            }
        });

    });



    return io;
};