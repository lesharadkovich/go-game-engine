exports.get = function (req, res) {
    res.render('game', {
        room: req.params.room
    });
};
