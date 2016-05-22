var math = require('math');

import * as logic from "./logic";

export class Problem {

  constructor(
    public goal: any,
    public given: Array<number>,
    public expr: String) {
    given.sort();
  }

  getGoalString(): String {
    let frac = this.goal;
    var s = frac.s == 1 ? "" : "-";
    if (frac.d == 1)
      return s+frac.n.toString();
    else
      return s+frac.n.toString()+"/"+frac.d.toString();
  }

}

export function getProblem(min: number, max:number, n: number, transforms = defaultTransforms): Problem {
  var nums = [];
  while (true) {
    for (var i=0; i<n; i++) {
      nums[i] = logic.getRandomInt(min, max);
    }
    var expr = logic.gen(nums, transforms).toString();
    var goal = math.eval(expr);
    if (goal.d != 0) {
      return new Problem(goal, nums, expr);
    }
  }
}

export var defaultTransforms = [
  logic.opTransform("+"),
  logic.opTransform("-"),
  logic.opTransform("*"),
  logic.opTransform("/")
];