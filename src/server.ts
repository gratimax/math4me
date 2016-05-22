import * as express from "express";
import * as socketio from "socket.io";

import * as game from "./game";

let app = express();
app.use(express.static('public'));

app.get('/:id/', function (req, res) {
  let id = req.params.id;
  if (id in game.games) {
    
  } else {
    res.redirect('/');
  }
});

let serve = app.listen(3000, () => {
  console.log("Started server on port 3000");
});

let io = socketio(serve);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
