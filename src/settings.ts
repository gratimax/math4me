import * as constants from "./constants";

export class GameSettings {
  constructor(
    public numGivenNumbers: number = constants.NUM_NUMS,
    public maxOption: number = constants.MAX_NUM,
    public enableDivision: boolean = false,
    public secondsEachProblem: number = constants.NUM_SECONDS_GIVEN,
    public numProblems: number = constants.NUMBER_PROBLEMS
  ) {}

  static fromObject(that: any): GameSettings {
    return new GameSettings(
      that.numGivenNumbers,
      that.maxOption,
      that.enableDivision,
      that.secondsEachProblem,
      that.numProblems
    );
  }
};