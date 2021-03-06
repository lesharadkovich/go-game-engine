var checkAuth = require('../middleware/checkAuth.js');
var checkGame = require('../middleware/checkGame.js');

module.exports = function (app) {

    app.get('/', require('./frontpage').get);

    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);

    app.post('/logout', require('./logout').post);

    app.get('/play', checkAuth, require('./play').get);

    app.get('/game/:room', checkAuth, checkGame, require('./game').get);

    app.get('/chat', checkAuth, require('./chat').get);

    app.get('/rating', require('./rating').get);

};
