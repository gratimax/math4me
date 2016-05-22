import * as SocketIOClient from "socket.io-client";

import setupUI from "./client/ui/setup";
import * as GameRole from "./client/gameRole";
import * as ClientGame from "./client/clientGame";

import User from "./user";

setupUI();

function getConnectUrl() {
  let href = window.location.href;
  return href.substr(0, href.length - window.location.pathname.length);
}

export let socket: SocketIOClient.Socket;

localStorage['debug'] = '*:socket';
window['socket'] = socket = SocketIOClient.connect(getConnectUrl());

let name = '';
while (!name) {
  name = prompt("Enter a name!")
}

socket.on('connect', () => {
  let game: ClientGame.ClientGame = new ClientGame.ClientGame(-1);
  let user: User = null;
  let gameRole = GameRole.create();

  window['game'] = game;

  if (gameRole instanceof GameRole.JoiningGame) {
    let role = gameRole as GameRole.JoiningGame;
    console.log(role.id);
    socket.once('didNotJoinGame', (data) => {
      alert(data.reason);
    });
    socket.once('joinedGame', (data) => {
      user = new User(data.userId, name);
      console.log(user);
    });
    socket.emit('joinGame', {id: role.id, name: name});

  } else {
    socket.once('createdGame', (data) => {
      game.id = data.id;
      user = new User(0, name);
      console.log(user);
    });
    socket.emit('createGame', {name: name});
  }
});
