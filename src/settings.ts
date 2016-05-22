import * as constants from "./constants";

export class GameSettings {
  constructor(
    public numGivenNumbers: number = constants.NUM_NUMS,
    public secondsEachProblem: number = constants.NUM_SECONDS_GIVEN,
    public numProblems: number = constants.NUMBER_PROBLEMS
  ) {}

  static fromObject(that: any): GameSettings {
    return new GameSettings(
      that.numGivenNumbers,
      that.secondsEachProblem,
      that.numProblems
    );
  }
};