import setupUI from "./client/ui/setup";
import setupSocket, {socket} from "./client/socket";

setupSocket();
setupUI();

var math = require("mathjs");
math.config({
  number: 'Fraction'
});

import * as logic from "./logic";
(window as any).logic = logic;
function getExprFrac(min: number, max:number, n: number, transforms): [string, any] {
  var nums = [];
  while(true)
  {
    for(var i=0; i<n; i++)
      nums[i] = logic.getRandomInt(min, max);
    var expr = logic.gen(nums, transforms).toString();
    var frac = math.eval(expr);
    if(frac.d != 0) {
      return [expr, frac];
    }
  }
}
function frac2s(frac) {
  var s = frac.s == 1 ? "" : "-";
  if(frac.d == 1)
    return s+frac.n.toString();
  else
    return s+frac.n.toString()+"/"+frac.d.toString();
}
var transforms = [
  logic.opTransform("+"),
  logic.opTransform("-"),
  logic.opTransform("*"),
  logic.opTransform("/")
];
var exprFrac = getExprFrac(10, 100, 10, transforms);
console.log(exprFrac[0]);
console.log(frac2s(exprFrac[1]));
