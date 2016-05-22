import * as logic from "./logic";

var math = require("mathjs");
math.config({
  number: 'Fraction'
});

export function getExprFrac(min: number, max:number, n: number, transforms = defaultTransforms): [string, any] {
  var nums = [];
  while(true)
  {
    for(var i=0; i<n; i++)
      nums[i] = logic.getRandomInt(min, max);
    var expr = logic.gen(nums, transforms).toString();
    try {
      var frac = math.eval(expr);
      return [expr, frac];
    } catch(e) { }
  }
}

export function frac2s(frac) {
  var s = frac.s == 1 ? "" : "-";
  if(frac.d == 1)
    return s+frac.n.toString();
  else
    return s+frac.n.toString()+"/"+frac.d.toString();
}

export var defaultTransforms = [
  logic.opTransform("+"),
  logic.opTransform("-"),
  logic.opTransform("*"),
  logic.opTransform("/")
];
