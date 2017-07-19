var mongoose = require('mongoose');
var config = require('../config');

var uri = process.env.MONGOLAB_URI || config.get('mongoose:uri');

mongoose.connect(uri, config.get('mongoose:options'));

module.exports = mongoose;
