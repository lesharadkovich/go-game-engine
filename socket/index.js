var log = require('../lib/log')(module);
var async = require('async');
var config = require('../config');
var cookieParser = require('cookie-parser');
var sessionStore = require('../lib/sessionStore');
var HttpError = require('../error').HttpError;
var mongoose = require('../lib/mongoose.js');
var User = require('../models/user').User;
var Game = require('../models/game').Game;


var Board = require('../board');
var Stone = require('../stone');
var Rules = require('../rules');


User.count(function(err, count) {
    console.log("users count: " + count);
});

Game.count(function(err, count) {
    console.log("games count: " + count);
});


User.find(function(err, users) {
    if(err) throw err;

    console.log("users: ");
    console.log(users);
});

Game.find({}, function(err, games) {
    if(err) throw err;

    console.log("games: ");
    console.log(games);
});

// Game.find().exec(function(err, games) {
//     if(err) throw err;

//     console.log("games: ");
//     console.log(games);
// });

// var id = "59400010aff3ab1e521d5d48";
// Game.findById(id, function(err, game) {
//     if(err) throw err;

//     console.log('id');
//     console.log(game);
// });


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
    console.log("inv: " + game.room);

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


function uuid() {
    var s4 = function () {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function createGame(username, enemyName, size) {
    var width = 700;
    var board = new Board(width, size);
    var stone = new Stone(board);
    var rules = new Rules();

    return {
        room: uuid(),
        "black": {
            name: username,
            score: 0,
            id: 0
        },
        "white": {
            name: enemyName,
            score: 0,
            id: 0
        },
        size: size,
        board: board,
        rules: rules,
        stone: stone,
        stonePlaces: size * size
    };
}

function getGame(room) {
    var game = -1;
    console.log("get game");
    
    User.find(function(err, _game) {
        console.log(_game);
        
        game = _game;
    });
    
    return game;
}

function isGameAvailible(size) {
    var game = -1;

    Game.findOne({size: size}, function(err, _game) {
        if (err) throw err;
        
        if(_game && _game["white"].id == 0) {
            game = _game;
        }
    });

    return game;
}

function isYourMove(username, gameIndex) {
    var currentMove = games[gameIndex].rules.currentPlayerColor;

    if (username === games[gameIndex][currentMove].name) return true;
    else return false;
}

function makeMove(addingCoords, game, io, socket) {

    //draw stone
    io.in(game.room).emit('drawStone', addingCoords, game.stone, game.board, game.rules);

    //add coords to array
    var indexOfCluster = game.rules.addCoords(game.board, addingCoords);
    //find surrounded coords
    var surroundedCoords = game.rules.checkClosure(game.board, indexOfCluster);
    //delete coords

    //delete stones
    io.in(game.room).emit('deleteStones', surroundedCoords, game.rules, game.board, game.stone);

    var yourColor = game.rules.currentPlayerColor;
    var enemyColor = game.rules.color[yourColor];

    game[yourColor].score += surroundedCoords.length;

    //changeInfoText(gameIndex, socket);
    var yourScore = game[yourColor].score;
    var enemyScore = game[enemyColor].score;
    socket.broadcast.to(game.room).emit('change score text', enemyScore, yourScore);
    socket.emit('change score text', yourScore, enemyScore);
    

    game.board.previousStone = addingCoords;
    game.rules.switchPlayer();

    game.stonePlaces--;
    game.save();
    if (game.stonePlaces == 0) {
        gameOver(io, game);
    }
}

function gameOver(io, game) {    
    //win or lose
    if (game["black"].score > game["white"].score) {
        var winId = game["black"].id;
        var loseId = game["white"].id;
    }
    else if (game["black"].score < game["white"].score) {
        var winId = games[gameIndex]["white"].id;
        var loseId = games[gameIndex]["black"].id;
    }
    //delete game
    
    var winSocket = io.sockets.connected[winId];
    var loseSocket = io.sockets.connected[loseId];
    
    //save to DB
    winSocket.handshake.user.wins++;
    winSocket.handshake.user.save();

    loseSocket.handshake.user.loses++;
    loseSocket.handshake.user.save();

    io.to(winId).emit('game over', 'Вы выиграли!');
    io.to(loseId).emit('game over', 'Вы проиграли!');
    
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//    games.splice(gameIndex, 1);
}

//
function changeInfoText(gameIndex, socket, username) {
    if(username === games[gameIndex]["black"].name) {
        var yourColor = "black";
        var enemyColor = "white";
        var move = true;
    } else {
        var yourColor = "white";
        var enemyColor = "black";
        var move = false;
    }
    
    var yourScore = games[gameIndex][yourColor].score;
    var enemyScore = games[gameIndex][enemyColor].score;
    
    var yourName = games[gameIndex][yourColor].name;
    var enemyName = games[gameIndex][enemyColor].name;

    socket.emit('change score text', yourScore, enemyScore);
    socket.emit('change info text', yourName, enemyName, move);
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
    
    
    io.on('connection', function(socket) {        
        var username = socket.handshake.user.username;
        
        getOnlineList(io, socket, username);
        socket.broadcast.emit('join');
        
        Game._find();
        
//        console.log(query);
        
        
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

            var game = new Game({size: size});
            game.init(username, enemyName);
            game.save(function(err, game, affected) {
                if(err) throw err;
                
                var creatorId = socket.id;

                sendInviteToEnemy(io, enemyName, username, game, creatorId);
            });
        });

        socket.on('new game with any player', function (size) {    
            var game = isGameAvailible(size);

            if (game >= 0) {  //if such game is availible
                game["white"].name = username;
                game["white"].id = socket.id;
                game.save();
                
                var creator = game["black"].id;

                socket.to(creator).emit('start game', username, game.room);
                socket.emit('start game', game["black"].name, game.room);
            }
            else { //if not, create new game
                var game = new mongoose.models.Game({size: size});
                game.init(username, 0);
                game.save();

                socket.emit('searching');
            }
        });

        //wait answer. if yes, join game room; if no, delete game
        socket.on('agreed', function (agreed, room, creatorId) {
            var game = getGame(room);

            console.log(room);
            console.log(game);
            if (agreed) {
                cancelOtherInvites(io, username, socket); 
                
                socket.to(creatorId).emit('start game', username, room);
                socket.emit('start game', game["black"].name, room);
            }
            else {
                //emit client that user refused
                socket.to(creatorId).emit('refused', username);
                //delete game
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                games.splice(gameIndex, 1);
            }
        });
    
    
        //namespace: game. Handles game requests
        socket.on('start', function(room) {
            var game = getGame(room);
            
            if(game["black"].name === username) {
                game["black"].id = socket.id;     
            }
            else if(game["white"].name === username) {
                game["white"].id = socket.id;
            }
            game.save();
            
            socket.join(game.room);
            
            io.in(game.room).emit('drawBoard', game.board);
            changeInfoText(gameIndex, socket, username);
        });

        socket.on('move', function (mousePos, room) {
            var game = getGame(room); //find room with username
            
            if (game < 0) return; //if no room, do nothing
            if (!isYourMove(username, gameIndex)) return;

            var addingCoords = game.stone.getPointCoords(game.board, mousePos);

            if (addingCoords && !game.board.isStoneExists(addingCoords)) {
                makeMove(addingCoords, game, io, socket);
            }
        });
    });



    return io;
};