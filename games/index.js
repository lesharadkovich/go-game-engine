'use strict'

var Board = require('../board');
var Stone = require('../stone');
var Rules = require('../rules');

class Game {
    constructor(username, enemyName, size, id) {
        var width = 700;
        var board = new Board(width, size);
        var stone = new Stone(board);
        var rules = new Rules();


        this.room = this.uuid();
        this["black"] = {
            name: username,
            score: 0,
            id: 0 || id
        };
        this["white"] = {
            name: enemyName,
            score: 0,
            id: 0
        };
        this.size = size;
        this.board = board;
        this.rules = rules;
        this.stone = stone;
        this.stonePlaces = size * size;
    }

    uuid() {
        var s4 = function () {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    }


    isYourMove(username) {
        var currentMove = this.rules.currentPlayerColor;

        return username === this[currentMove].name;
    }

    makeMove(addingCoords, io, socket) {
        var indexOfCluster = this.addStone(addingCoords, io);

        this.deleteStones(indexOfCluster, io, socket);

        this.board.previousStone = addingCoords;
        this.rules.switchPlayer();

        this.stonePlaces--;
        if (this.stonePlaces == 0) {
            //game over
            this.gameOver(io);
            //delete game
            var gameIndex = getGameIndex(this.room);
            games.splice(gameIndex, 1);
        }
    }

    addStone(addingCoords, io) {
        //draw stone
        io.in(this.room).emit('drawStone', addingCoords, this.stone, this.board, this.rules);

        //add coords to array
        var indexOfCluster = this.rules.addCoords(this.board, addingCoords);

        return indexOfCluster;
    }

    deleteStones(indexOfCluster, io, socket) {
        //find surrounded coords
        var surroundedCoords = this.rules.checkClosure(this.board, indexOfCluster);

        //delete coords
        for (var i = 0; i < surroundedCoords.length; i++) {
            for (var j = 0; j < surroundedCoords[i].length; j++) {
                var surrounded = surroundedCoords[i][j];

                this.rules.deleteCoords(surrounded, board, enemyColor);
            }
        }

        //delete stones
        io.in(this.room).emit('deleteStones', surroundedCoords, this.rules, this.board, this.stone);

        var yourColor = this.rules.currentPlayerColor;
        var enemyColor = this.rules.color[yourColor];

        this[yourColor].score += surroundedCoords.length;

        var yourScore = this[yourColor].score;
        var enemyScore = this[enemyColor].score;
        socket.broadcast.to(this.room).emit('change score text', enemyScore, yourScore);
        socket.emit('change score text', yourScore, enemyScore);
    }

    gameOver(io) {
        //win or lose
        if (this["black"].score > this["white"].score) {
            var winId = this["black"].id;
            var loseId = this["white"].id;
        }
        else if (this["black"].score < this["white"].score) {
            var winId = this["white"].id;
            var loseId = this["black"].id;
        }

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

    //
    setInfoText(socket, username) {
        if (username === this["black"].name) {
            var yourColor = "black";
            var enemyColor = "white";
            var move = true;
        } else {
            var yourColor = "white";
            var enemyColor = "black";
            var move = false;
        }

        var yourScore = this[yourColor].score;
        var enemyScore = this[enemyColor].score;

        var yourName = this[yourColor].name;
        var enemyName = this[enemyColor].name;

        socket.emit('set info text', yourName, enemyName, yourScore, enemyScore, move);
    }
}

function getGameByRoom(room) {
    var game = -1;
    
    games.forEach(function (current, i, games) {
        if (current.room === room) {
            game = current;
            return;
        }
    });

    return game;
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
    var game = -1;

    games.forEach(function (current, i, games) {
        if ((size === current.size) && current["white"].id == 0) {
            game = current;
            return;
        }
    });

    return game;
}


var games = []; //stores info about active games: roomId, players, etc


module.exports.games = games;
module.exports.Game = Game;
module.exports.getGameByRoom = getGameByRoom;
module.exports.getGameIndex = getGameIndex;
module.exports.isGameAvailible = isGameAvailible;