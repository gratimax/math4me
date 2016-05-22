import * as express from "express";
import * as socketio from "socket.io";

var app = express();

app.use(express.static('public'));

var serve = app.listen(3000, () => {
  console.log("Started server on port 3000");
});

var io = socketio(serve);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
