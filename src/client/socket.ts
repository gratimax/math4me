import * as SocketIOClient from "socket.io-client";

export let socket: SocketIOClient.Socket;

export default function setupSocket() {
  socket = SocketIOClient.connect(window.location.href);
  console.log("socket " + socket.toString() + " setup");
}