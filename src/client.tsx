import * as SocketIOClient from "socket.io-client";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {ClientGame, GameRole, GameStage} from "./client/clientGame";
import User from "./user"
import * as ui from "./client/ui";

class Main extends React.Component<{}, {game: ClientGame}> {

  constructor(props: {}) {
    super(props);
    this.state = {
      game: new ClientGame(null, null, GameRole.create(), new GameStage.PromptingForName())
    };
  }
  
  handleSocket(name: String) {
    let socket: SocketIOClient.Socket;

    localStorage['debug'] = '*:socket';
    console.log(ClientGame.getConnectUrl());
    window['socket'] = socket = SocketIOClient.connect(ClientGame.getConnectUrl());

    let game = this.state.game;

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
          this.forceUpdate();
        });
        socket.emit('joinGame', {id: id, name: name});
      } else {
        game.stage = new GameStage.Waiting("trying to create game");
        this.forceUpdate();
        console.log(game instanceof ClientGame);
        socket.once('createdGame', (data) => {
          game.id = data.id;
          game.user = new User(0, name);
          game.stage = new GameStage.StartedLobby();
          this.forceUpdate();
          socket.on('allUsers', (data) => {

          });
        });
        socket.emit('createGame', {name: name});
      }
    });
  }

  eventHandler(evt, data) {
    if (evt == 'gotName') {
      this.handleSocket(data);
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