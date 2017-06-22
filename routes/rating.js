var User = require('../models/user.js').User;

exports.get = function(req, res, next) {
    
    User.count({}, function(err, count) {
        console.log(count);
    });
    
    User.find({}, function (err, users) {
      res.render('rating', {
        userList: users
      });
    });

};