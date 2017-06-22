var Game = require('../models/game.js').Game;
var HttpError = require('../error').HttpError;

module.exports = function (req, res, next) {
    var room = req.params.room;

    Game.find(function(err, games) {
        console.log(games);
    });
    
    Game.findOne({room: room}, function (err, game) {        
        if (!game) {
            return next(new HttpError(401, "Игра не найдена")); 
        }
    })

    next();
};
