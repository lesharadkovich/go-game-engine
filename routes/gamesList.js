var Game = require('../models/game.js').Game;
var mongoose = require('../lib/mongoose.js');

exports.get = function (req, res, next) {
    var db = mongoose.connection.db;

    var games = mongoose.connection.collections.games;
    // console.log(games);

    Game.findOne({}, function(err, game) {
        console.log(game);
    })

    // games.findOne({}, function(err, game) {
    //     console.log(game);
    // });

    db.collection('games', function (error, collection) {
        collection.find(function (error, games) {
            if(error) throw error;
             console.log(games);

            res.render('gamesList', {
                gamesList: games
            });
        });
    });


    // Game.count({}, function (err, count) {
    //     console.log(count);
    // });

    // Game.find({}, function (err, games) {
    //     if (err) throw err;

    //     console.log(games);

    //     res.render('gamesList', {
    //         gamesList: games
    //     });
    // });

};