import * as path from "path";

import * as express from "express";
import * as socketio from "socket.io";

import * as game from "./game";

let app = express();
app.use(express.static('public'));

app.get('/:id/', function (req, res) {
  let id = parseInt(req.params.id);
  if (game.hasId(id)) {
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
  let socketGame: game.Game = null;

  socket.on('createGame', function (data) {
    var newGame = new game.Game();
    game.addGame(newGame);
    socket.emit('createdGame', {id: newGame.id});
    console.log('joining to room ' + newGame.getRoom());
    socket.join(newGame.getRoom());
    let user = newGame.addUser(data.name);
    socketGame = newGame;
    socket.emit('joinedGame', {userId: user.id, name: data.name});
  });

  socket.on('joinGame', function (data) {
    // expects id, name
    let id: number = data.id;
    if (!game.hasId(id)) {
      socket.emit('didNotJoinGame', {reason: 'game did not exist'});
    } else {
      let joinGame = game.getById(id);
      if (!(joinGame.stage instanceof game.GameStage.WaitingForUsers)) {
        socket.emit('didNotJoinGame', {reason: 'game is closed'});
      } else {
        socketGame = joinGame;
        console.log('joining to room ' + joinGame.getRoom());
        socket.join(joinGame.getRoom());
        let user = joinGame.addUser(data.name);
        socket.emit('joinedGame', {userId: user.id, name: data.name});
        io.to(joinGame.getRoom()).emit('userJoined', {userId: user.id, name: data.name});
      }
    }
  });

  socket.on('startGame', function () {
    let timer = null;
    function doTick() {
      console.log('tick game' + socketGame.id);
      if (socketGame.canMakeProblem()) {
        let prob = socketGame.makeProblem();
        io.to(socketGame.getRoom()).emit('newProblem', {given: prob.given, goal: prob.goal});
      } else {
        clearInterval(timer);
        socketGame.finish();
        io.to(socketGame.getRoom()).emit('finishedGame');
      }
    }
    if (socketGame) {
      doTick();
      timer = setInterval(doTick, 1000);
    }
  });

  socket.on('entered', function (data) {
    let date = new Date();
    if (socketGame) {
      if (socketGame.isRight(data.expr)) {
        let score = socketGame.getScore(date);
        socketGame.incrementScore(data.userId, score);
      }
    }
  });

});
