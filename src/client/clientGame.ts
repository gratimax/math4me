import User from "../user";

export namespace GameRole {

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

}

export namespace GameStage {

  export interface GameStage {}

  export class JoinGameFailed implements GameStage {
    constructor(public reason: string) {}
  }

}

export class ClientGame {
  public constructor(
    public id: number,
    public user: User,
    public role: GameRole.GameRole,
    public stage: GameStage.GameStage) {}
}