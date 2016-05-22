export interface StartingState {}

export class StartingGame implements StartingState {
}

export class JoiningGame implements StartingState {
  constructor(public id: String) {}
}

export function create(pathname: String): StartingState {
  if (pathname == '/') {
    return new StartingGame();
  } else {
    return new JoiningGame(pathname.substr(1));
  }
}