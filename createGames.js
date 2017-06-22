var mongoose = require('./lib/mongoose.js');
var async = require('async');

var Game;

async.series([
  open,
  requireModels,
  print,
   dropDatabase,
  //  createUsers,
], function (err) {
  console.log("exit");
  mongoose.disconnect();
  process.exit(err ? 255 : 0);
});

function open(callback) {
  mongoose.connection.on('open', callback);
}

function requireModels(callback) {
  Game = require('./models/game.js').Game;

  console.log('1');
  Game.on('index', callback);
  console.log('2');
  // callback();
}

function print(callback) {
  console.log("print");
  Game.find(function (err, games) {
    console.log(games);
  });
  callback();
}

function dropDatabase(callback) {
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
}

function createUsers(callback) {

  var users = [
    { size: 5 }
  ];

  async.each(users, function (userData, callback) {
    var user = new mongoose.models.Game(userData);
    user.save(callback);
    user.init('John', 'camel');
    console.log(user["black"].name);
  }, callback);

}