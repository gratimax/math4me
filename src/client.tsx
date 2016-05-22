import * as SocketIOClient from "socket.io-client";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {ClientGame, GameRole, GameStage} from "./client/clientGame";
import {ClientProblem} from "./client/clientProblem";
import User from "./user"
import * as ui from "./client/ui";
import {GameSettings} from "./settings";

class Main extends React.Component<{}, {game: ClientGame}> {

  constructor(props: {}) {
    super(props);
    this.state = {
      game: new ClientGame(
        null,
        null,
        GameRole.create(),
        new GameStage.PromptingForName(),
        null,
        null,
        null
      )
    };
  }
  
  handleSocket(name: string) {
    let game = this.state.game;

    localStorage['debug'] = '*:socket';
    let socket = window['socket'] = game.socket = SocketIOClient.connect(ClientGame.getConnectUrl());

    function onUsers(data: any) {
      game.users = data.users.map(
        (obj: {id: number, name: string}) => {
          if (obj.id == game.user.id) {
            return game.user;
          } else {
            return new User(obj.id, obj.name, 0);
          }
        }
      );
    }

    game.stage = new GameStage.Waiting("setting up sockets...");
    this.forceUpdate();

    socket.on('connect', () => {
      window['game'] = game;
      if (game.role instanceof GameRole.JoiningGame) {
        let id = (game.role as GameRole.JoiningGame).id;
        game.id = id;
        game.stage = new GameStage.Waiting("trying to join game " + id);
        this.forceUpdate();
        socket.once('didNotJoinGame', (data) => {
          game.stage = new GameStage.JoinGameFailed(data.reason);
          this.forceUpdate();
        });
        socket.once('joinedGame', (data) => {
          game.user = new User(data.userId, name, 0);
          game.totalProblems = data.numProblems;
          game.stage = new GameStage.WaitingLobby(GameSettings.fromObject(data.settings));
          socket.on('allUsers', (data) => {
            onUsers(data);
            this.forceUpdate();
          });
          socket.on('gameStarting', this.onGameStart.bind(this));
          this.forceUpdate();
        });
        socket.on('settingsChanged', (data) => {
          let stage = game.stage as GameStage.WaitingLobby;
          stage.settings = GameSettings.fromObject(data.settings);
          this.forceUpdate();
        })
        socket.emit('joinGame', {id: id, name: name});
      } else {
        game.stage = new GameStage.Waiting("trying to create game");
        this.forceUpdate();
        socket.once('createdGame', (data) => {
          game.id = data.id;
          game.totalProblems = data.numProblems;
          game.user = new User(0, name, 0);
          game.stage = new GameStage.StartedLobby(new GameSettings());
          this.forceUpdate();
          socket.on('allUsers', (data) => {
            onUsers(data);
            this.forceUpdate();
          });
        });
        socket.emit('createGame', {name: name});
      }
    });
  }

  onGameStart() {
    let game = this.state.game;
    let socket = game.socket;
    game.stage = new GameStage.Waiting("Game is about to start!");
    this.forceUpdate();
    socket.on('newProblem', (data) => {
      let problem = new ClientProblem(data.given, data.goal, data.ops, data.problemNumber);
      game.stage = new GameStage.DoingProblem(problem);
      this.forceUpdate();
    });
    socket.on('answerProblem', (data) => {
      let problem = (game.stage as GameStage.DoingProblem).problem;
      game.stage = new GameStage.AnswerProblem(problem, data.expr);
      this.forceUpdate();
    });
    socket.on('userScore', this.onUserScore.bind(this));
    socket.on('finishedGame', (data) => {
      let scores: [[number, number]] = data.scores;
      console.log(scores);
      for (let i = 0; i < scores.length; i++) {
        let sc = scores[i];
        this.setUserScore(sc[0], sc[1]);
      }
      game.users.sort((a, b) => {
        return b.score - a.score;
      })
      game.stage = new GameStage.FinishedGame();
      this.forceUpdate();
    });
    socket.on('userGotValue', (data) => {
      let problem = (game.stage as GameStage.DoingProblem).problem;
      problem.currentValues[data.userId] = data.value;
      this.forceUpdate();
    });
  }

  setUserScore(userId: number, score: number) {
    let game = this.state.game;
    for (var i = 0; i < game.users.length; i++) {
      let user = game.users[i];
      if (user.id == userId) {
        user.score = score;
      }
    }
  }

  onUserScore(data: {userId: number, score: number}) {
    this.setUserScore(data.userId, data.score);
    let game = this.state.game;
    let problem = (game.stage as GameStage.DoingProblem).problem;
    problem.whoGotIt.push(data.userId);
    this.forceUpdate();
  }

  startGame() {
    let game = this.state.game;
    let socket = game.socket;
    socket.on('gameStarting', this.onGameStart.bind(this));
    socket.emit('startGame');
  }

  haveExpr(expr: String) {
    let game = this.state.game;
    game.socket.emit('entered', {userId: game.user.id, expr: expr});
  }

  eventHandler(evt, data) {
    if (evt == 'gotName') {
      this.handleSocket(data);
    } else if (evt == 'startGame') {
      this.startGame();
    } else if (evt == 'haveExpr') {
      this.haveExpr(data);
    }
  }

  render() {
    return <ui.GameUI game={this.state.game} handler={this.eventHandler.bind(this)}/>;
  }

}

ReactDOM.render(
  <Main/>,
  document.getElementById("container")
);