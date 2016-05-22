import * as SocketIOClient from "socket.io-client";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {ClientGame, GameRole, GameStage} from "./client/clientGame";
import {ClientProblem} from "./client/clientProblem";
import User from "./user"
import * as ui from "./client/ui";

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
        null
      )
    };
  }
  
  handleSocket(name: String) {
    let game = this.state.game;

    localStorage['debug'] = '*:socket';
    console.log(ClientGame.getConnectUrl());
    let socket = window['socket'] = game.socket = SocketIOClient.connect(ClientGame.getConnectUrl());

    function onUsers(data: any) {
      game.users = data.users.map(
        (obj: {id: number, name: String}) => {
          if (obj.id == game.user.id) {
            return game.user;
          } else {
            return new User(obj.id, obj.name);
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
          game.user = new User(data.userId, name);
          game.stage = new GameStage.WaitingLobby();
          socket.on('allUsers', (data) => {
            onUsers(data);
            this.forceUpdate();
          });
          socket.on('gameStarting', this.onGameStart.bind(this));
          this.forceUpdate();
        });
        socket.emit('joinGame', {id: id, name: name});
      } else {
        game.stage = new GameStage.Waiting("trying to create game");
        this.forceUpdate();
        socket.once('createdGame', (data) => {
          game.id = data.id;
          game.user = new User(0, name);
          game.stage = new GameStage.StartedLobby();
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
    game.stage = new GameStage.Waiting("Game is about to start!");
    this.forceUpdate();
    game.socket.on('newProblem', (data) => {
      let problem = new ClientProblem(data.given, data.goal, data.ops);
      game.stage = new GameStage.DoingProblem(problem);
      this.forceUpdate();
    });
  }

  startGame() {
    let game = this.state.game;
    let socket = game.socket;
    socket.on('gameStarting', this.onGameStart.bind(this))
    socket.emit('startGame');
  }

  eventHandler(evt, data) {
    if (evt == 'gotName') {
      this.handleSocket(data);
    } else if (evt == 'startGame') {
      this.startGame();
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