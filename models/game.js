var crypto = require('crypto');
var async = require('async');
var util = require('util');


var Board = require('../board');
var Stone = require('../stone');
var Rules = require('../rules');


var mongoose = require('../lib/mongoose.js'),
    Schema = mongoose.Schema;


function uuid() {
    var s4 = function () {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

var schema = new Schema({
    _id: {
        type: String,
        default: uuid()
    },
    // room: {
    //     type: String,
    //     default: uuid()
    // },
    "black": {
        name: {
            type: String,
        },
        id: {
            type: String,
            default: 0
        },
        score: {
            type: Number,
            default: 0
        }
    },
    "white": {
        name: {
            type: String,
        },
        id: {
            type: String,
            default: 0
        },
        score: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: Number,
        required: true,
    },
    stonePlaces: Number,
    board: Schema.Types.Mixed,
    rules: Schema.Types.Mixed,
    stone: Schema.Types.Mixed
});


schema.methods.init = function(username, enemyname) {
    var width = 700;
    var board = new Board(width, this.size);
    var stone = new Stone(board);
    var rules = new Rules();
    
    this.board = board;
    this.stone = stone;
    this.rules = rules;
    
    this["black"].name = username;
    this["white"].name = enemyname;
    
    this.stonePlaces = this.size * this.size;
    
//    this.save();
    
}

schema.statics._find = function() {
    var Game = this;
    
        console.log("search");
    Game.find({}, function (err, games) {
        if(err) throw err;
        
      console.log(games);
    });

    Game.findById("59400010aff3ab1e521d5d48", function(err, game) {
        // console.log(game);

    });
}
    
exports.Game = mongoose.model('Game', schema);