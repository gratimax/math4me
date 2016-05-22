import * as path from "path";

import * as express from "express";
import * as socketio from "socket.io";

import * as game from "./game";

let app = express();
app.use(express.static('public'));

app.get('/:id/', function (req, res) {
  let id = parseInt(req.params.id);
  if (id in game.games) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.redirect('/');
  }
});

let serve = app.listen(3000, () => {
  console.log("Started server on port 3000");
});

let io = socketio(serve);

io.on('connection', function (socket) {
  socket.on('createGame', function () {
    var newGame = new game.Game();
    game.addGame(newGame);
    socket.emit('createdGame', {id: newGame.id});
  });
});
