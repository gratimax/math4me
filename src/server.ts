import * as path from "path";

import * as express from "express";
import * as socketio from "socket.io";

import * as game from "./game";
import * as constants from "./constants";

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
      console.log('tick game' + socketGame.id + ', #' + socketGame.round);
      if (socketGame.canMakeProblem()) {
        let prob = socketGame.makeProblem();
        io.to(socketGame.getRoom()).emit('newProblem', {given: prob.given, goal: prob.getGoalString(), ops: prob.ops});
        setTimeout(sendAnswer, constants.NUM_SECONDS_GIVEN * 1000);
      } else {
        socketGame.finish();
        io.to(socketGame.getRoom()).emit('finishedGame');
      }
    }
    function sendAnswer() {
      io.to(socketGame.getRoom()).emit('answerProblem', {expr: socketGame.getProblemAnswer()});
      setTimeout(newProblem, constants.NUM_SECONDS_ANSWER * 1000);
    }
    if (socketGame) {
      io.to(socketGame.getRoom()).emit('allUsers', {users: socketGame.getUsers()});
      io.to(socketGame.getRoom()).emit('gameStarting');
      setTimeout(newProblem, constants.NUM_SECONDS_START * 1000);
    }
  });

  socket.on('entered', function (data) {
    console.log('got-entered');
    let date = new Date();
    if (socketGame) {
      console.log(socketGame.isRight(data.expr));
      let problem = (socketGame.stage as game.GameStage.Playing).problem;
      if (!problem.didSolve(data.userId) && socketGame.isRight(data.expr)) {
        problem.setSolved(data.userId);
        let score = socketGame.getScore(date);
        let newScore = socketGame.incrementScore(data.userId, score);
        io.to(socketGame.getRoom()).emit('userScore', {userId: data.userId, score: newScore});
      }
    }
  });

});
