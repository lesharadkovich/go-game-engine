var User = require('../models/user.js').User;

exports.get = function(req, res, next) {

    User.find({}, function (err, users) {
      res.render('rating', {
        userList: users
      });
    });

};