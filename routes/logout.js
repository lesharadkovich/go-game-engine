exports.post = function(req, res, next) {
  var io = req.app.get('io');
  var sid = req.session.id;

  req.session.destroy(function (err) {
      var onlineListId = Object.keys(io.sockets.sockets);

      onlineListId.forEach(function (socketId) {
          var socket = io.sockets.connected[socketId];

          if (socket.handshake.session.id == sid) {
              socket.emit('logout');
              socket.disconnect();
          }
      });


      if (err) return next(err);
      res.redirect('/');
  });
}