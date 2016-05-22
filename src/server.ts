import * as path from "path";

import * as express from "express";
import * as socketio from "socket.io";

import * as game from "./game";

let app = express();
app.use(express.static('public'));

app.get('/:id/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
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
    io.to(socketGame.getRoom()).emit('allUsers', {users: socketGame.getUsers()});
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
        io.to(socketGame.getRoom()).emit('allUsers', {users: socketGame.getUsers()});
      }
    }
  });

  socket.on('startGame', function () {
    function newProblem() {
      console.log('tick game' + socketGame.id);
      if (socketGame.canMakeProblem()) {
        let prob = socketGame.makeProblem();
        io.to(socketGame.getRoom()).emit('newProblem', {given: prob.given, goal: prob.getGoalString()});
        setTimeout(sendAnswer, 15 * 1000);
      } else {
        socketGame.finish();
        io.to(socketGame.getRoom()).emit('finishedGame');
      }
    }
    function sendAnswer() {
      io.to(socketGame.getRoom()).emit('answerProblem', {expr: socketGame.getProblemAnswer()});
      setTimeout(newProblem, 5 * 1000);
    }
    if (socketGame) {
      io.to(socketGame.getRoom()).emit('allUsers', {users: socketGame.getUsers()});
      newProblem();
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
