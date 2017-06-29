var HttpError = require('../error').HttpError;
var games = require('../games').games;
var func = require('../games').getGameByRoom;

module.exports = function (req, res, next) {


    if (func(req.params.room) == -1) {
        return next(new HttpError(401, "Игра не найдена"));
    }

    next();
};