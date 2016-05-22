import * as SocketIOClient from "socket.io-client";
import User from "../user";
import {ClientProblem} from "./clientProblem";

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

  export class PromptingForName implements GameStage {}

  export class JoinGameFailed implements GameStage {
    constructor(public reason: string) {}
  }

  export class Waiting implements GameStage {
    constructor(public message: string) {}
  }

  export class StartedLobby implements GameStage {}

  export class WaitingLobby implements GameStage {}

  export class DoingProblem implements GameStage {
    constructor(public problem: ClientProblem) {}
  }

  export class AnswerProblem implements GameStage{
    constructor(public problem: ClientProblem, public answer: string) {}
  }

  export class FinishedGame implements GameStage {
    
  }

}

export class ClientGame {
  constructor(
    public id: number,
    public user: User,
    public role: GameRole.GameRole,
    public stage: GameStage.GameStage,
    public users: Array<User>,
    public socket: SocketIOClient.Socket,
    public totalProblems: number) {}

  static getConnectUrl(): String {
    let href = window.location.href;
    return href.substr(0, href.length - window.location.pathname.length);
  }

  getLink(): String {
    return ClientGame.getConnectUrl() + '/' + this.id;
  }
}