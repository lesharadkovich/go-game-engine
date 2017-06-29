exports.post = function (req, res, next) {
  var sid = req.session.id;

  var io = req.app.get('io');
  req.session.destroy(function (err) {
    // io.sockets.emit("logout", sid);
    if (err) return next(err);

    res.redirect('/');
  });
};


// exports.post = function (req, res, next) {
//   const sid = req.session.id;
//   const io = req.app.get('io');

//   req.session.destroy((err) => {
//     if (io) {
//       //io.sockets.emit("session:reload", sid);
//       io.sockets._events.sessreload(sid);
//     }

//     if (err) return next(err);
//     res.redirect('/');
//   });
// };