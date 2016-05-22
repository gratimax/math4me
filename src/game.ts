import User from "./user";
import * as problem from "./problem";
import * as constants from "./constants";

let gameId = 0;

export namespace GameStage {

  export interface Stage {}

  export class WaitingForUsers implements Stage {}
  export class Playing implements Stage {
    constructor(public problem: problem.Problem, public date: Date) {}
  }
  export class Concluded implements Stage {}

}

export class Game {

  public users: Array<User> = [];
  public id: number;
  public stage: GameStage.Stage = new GameStage.WaitingForUsers();
  public score: {[id: number]: number} = {};
  public round: number = 0;

  constructor() {
    this.users = [];
    this.id = gameId;
    gameId++;
    this.stage = new GameStage.WaitingForUsers();
  }

  addUser(name: string): User {
    let newUser = new User(this.users.length, name, 0);
    this.users.push(newUser);
    return newUser;
  }

  getRoom(): string {
    return `game-${this.id}`
  }

  canMakeProblem(): boolean {
    return this.round < constants.NUMBER_PROBLEMS;
  }

  makeProblem(): problem.Problem {
    this.round++;
    let prob = problem.getProblem(0, 3, 1);
    prob.problemNumber = this.round;
    this.stage = new GameStage.Playing(prob, new Date());
    return prob;
  }

  finish() {
    this.stage = new GameStage.Concluded();
  }
  
  isRight(expr: string): boolean {
    if (this.stage instanceof GameStage.Playing) {
      return (this.stage as GameStage.Playing).problem.isRight(expr);
    } else {
      return false;
    }
  }

  getScore(date: Date): number {
    let stageDate = (this.stage as GameStage.Playing).date;
    return constants.NUM_SECONDS_GIVEN - (date.getTime() - stageDate.getTime())/1000;
  }

  incrementScore(userId: number, score: number) {
    if (userId in this.score) {
      this.score[userId] = this.score[userId] + score;
    } else {
      this.score[userId] = score;
    }
    return this.score[userId];
  }

  getUsers(): Array<{id: number, name: String}> {
    return this.users.map((user) => {
      return {id: user.id, name: user.name}
    });
  }

  getProblemAnswer(): String {
    return (this.stage as GameStage.Playing).problem.expr;
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