export interface GameRole {}

export class StartingGame implements GameRole {
}

export class JoiningGame implements GameRole {
  constructor(public id: String) {}
}

export function create(): GameRole {
  let pathname = window.location.pathname;
  if (pathname == '/') {
    return new StartingGame();
  } else {
    return new JoiningGame(pathname.substr(1));
  }
}