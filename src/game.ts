import User from "./user";
import * as problem from "./problem";

let gameId = 0;

export namespace GameStage {

  export interface Stage {}

  export class WaitingForUsers implements Stage {}
  export class Playing implements Stage {
    constructor(public problem: problem.Problem) {}
  }
  export class Concluded implements Stage {}

}

export class Game {

  public users: Array<User> = [];
  public id: number;
  public stage: GameStage.Stage = new GameStage.WaitingForUsers();
  public score: {[id: number]: number} = {};
  public round: number = 10;

  constructor() {
    this.users = [];
    this.id = gameId;
    gameId++;
    this.stage = new GameStage.WaitingForUsers();
  }

  addUser(name: String): User {
    let newUser = new User(this.users.length, name);
    this.users.push(newUser);
    return newUser;
  }

  getRoom(): string {
    return `game-${this.id}`
  }

  canMakeProblem(): boolean {
    return this.round > 0;
  }

  makeProblem(): problem.Problem {
    let prob = problem.getProblem(0, 10, 5);
    this.stage = new GameStage.Playing(prob);
    this.round--;
    return prob;
  }

  finish() {
    this.stage = new GameStage.Concluded();
  }
  
}

let games: {[id: number]: Game} = {};

export function hasId(id: number) {
  return id in games;
}

export function addGame(game: Game) {
  games[game.id] = game;
}

export function getById(id: number) {
  return games[id];
}