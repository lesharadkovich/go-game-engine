var mongoose = require('mongoose');
var config = require('../config');

// var uri = process.env.MONGOLAB_URI || config.get('mongoose:uri');
var uri = "mongodb://admin:admin@ds161012.mlab.com:61012/go-game";

mongoose.connect(uri, config.get('mongoose:options'));

module.exports = mongoose;
