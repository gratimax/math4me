var math = require('mathjs');

import * as logic from "./logic";

export class Problem {

  constructor(
    public goal: any,
    public given: Array<number>,
    public expr: string,
    public ops: string[],
    public usersCorrect: Array<number> = [],
    public problemNumber: number = 0) {
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

  isRight(expr: string): boolean {
    var toks = expr.replace("(", "( ").replace(")", ") ").split(" ");
    var given = this.given.slice(0);
    var match;
    try {
      match = math.equal(math.eval(expr), this.goal);
    } catch(e) {
      return false;
    }
    if(match) {
      for(var i=0; i<toks.length; i++) {
        var tok = toks[i];
        if(tok != "") {
          var num = parseInt(tok);
          if(num != NaN) {
            var index = given.indexOf(num);
            if(index == -1)
              return false;
            else
              given.splice(index, 1);
          } else if(this.ops.indexOf(tok) == -1) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  setSolved(userId: number) {
    if (this.usersCorrect.indexOf(userId) == -1) {
      this.usersCorrect.push(userId);
    }
  }

  didSolve(userId: number) {
    return this.usersCorrect.indexOf(userId) != -1;
  }
}

export function getProblem(min: number, max:number, n: number, transforms = defaultTransforms): Problem {
  var nums = [];
  while (true) {
    for (var i=0; i<n; i++) {
      nums[i] = logic.getRandomInt(min, max);
    }
    var tup = logic.gen(nums, transforms);
    var expr = tup[0].toString();
    var ops = transforms.map((t: logic.OpTransform) => t.op);
    try {
      var goal = math.eval(expr);
      return new Problem(goal, nums, expr, ops);
    } catch(e) { }
  }
}

export var defaultTransforms = [
  new logic.OpTransform("+"),
  new logic.OpTransform("-"),
  new logic.OpTransform("*"),
  // new logic.OpTransform("/")
];
