import * as SocketIOClient from "socket.io-client";

import * as GameRole from "./gameRole";
import * as ClientGame from "./clientGame";

export let socket: SocketIOClient.Socket;

function getConnectUrl() {
  let href = window.location.href;
  return href.substr(0, href.length - window.location.pathname.length);
}

export default function setupSocket() {
  localStorage['debug'] = '*';
  window['socket'] = socket = SocketIOClient.connect(getConnectUrl());

  let name = '';
  while (!name) {
    name = prompt("Enter a name!")
  }

  socket.on('connect', () => {
    let game: ClientGame.ClientGame = new ClientGame.ClientGame(-1);
    let gameRole = GameRole.create();

    window['game'] = game;

    if (gameRole instanceof GameRole.JoiningGame) {
      let role = gameRole as GameRole.JoiningGame;
      alert('hay');
      console.log(role.id);
      socket.once('didNotJoinGame', (data) => {
        alert(data.reason);
      });
      socket.once('joinedGame', (data) => {
        console.log(data);
      });
      socket.emit('joinGame', {id: role.id, name: name});

    } else {
      socket.once('createdGame', (data) => {
        game.id = data.id;
      });
      socket.emit('createGame', {name: name});
    }
    console.log("socket " + socket.toString() + " setup");
  });

}