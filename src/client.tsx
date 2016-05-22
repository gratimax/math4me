import * as SocketIOClient from "socket.io-client";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {ClientGame, GameRole, GameStage} from "./client/clientGame";
import User from "./user"
import * as ui from "./client/ui";

function getConnectUrl() {
  let href = window.location.href;
  return href.substr(0, href.length - window.location.pathname.length);
}

class Main extends React.Component<{}, ClientGame> {

  constructor(props: {}) {
    super(props);
    this.state = new ClientGame(null, null, GameRole.create(), new GameStage.PromptingForName());
  }

  updateState() {
    this.setState(this.state);
  }

  handleSocket() {
    let socket: SocketIOClient.Socket;

    localStorage['debug'] = '*:socket';
    window['socket'] = socket = SocketIOClient.connect(getConnectUrl());

    let name = '';
    while (!name) {
      name = prompt("Enter a name!")
    }

    socket.on('connect', () => {
      window['game'] = this.state;
      if (this.state.role instanceof GameRole.JoiningGame) {
        socket.once('didNotJoinGame', (data) => {
          this.state.stage = new GameStage.JoinGameFailed(data.reason);
          this.updateState();
        });
        socket.once('joinedGame', (data) => {
          this.state.user = new User(data.userId, name);
          this.updateState();
        });
        socket.emit('joinGame', {id: (this.state.role as GameRole.JoiningGame).id, name: name});
      } else {
        socket.once('createdGame', (data) => {
          this.state.id = data.id;
          this.state.user = new User(0, name);
        });
        socket.emit('createGame', {name: name});
      }
    });
  }

  eventHandler(evt, data) {
    if (evt == 'gotName') {
      this.handleSocket();
    }
  }


  render() {
    return <ui.GameUI game={this.state} handler={this.eventHandler.bind(this)}/>;
  }

}

ReactDOM.render(
  <Main/>,
  document.getElementById("container")
);