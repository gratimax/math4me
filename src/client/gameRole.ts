export interface GameRole {}

export class StartingGame implements GameRole {
}

export class JoiningGame implements GameRole {
  constructor(public id: number) {}
}

export function create(): GameRole {
  let pathname = window.location.pathname;
  if (pathname == '/') {
    return new StartingGame();
  } else {
    return new JoiningGame(parseInt(pathname.substr(1)));
  }
}