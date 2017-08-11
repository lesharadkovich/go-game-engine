var HttpError = require('../error').HttpError;
var games = require('../games').games;
var getGameByRoom = require('../games').getGameByRoom;

module.exports = function (req, res, next) {

    if (getGameByRoom(req.params.room) == -1) {
        return next(new HttpError(404, "Игра не найдена"));
    }

    next();
};