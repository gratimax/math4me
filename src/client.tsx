import {Game} from "./game";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socket from "socket.io-client";

var math = require("mathjs");
math.config({
  number: 'Fraction'
});

import * as logic from "./logic";
(window as any).logic = logic;
function getExprFrac(min: number, max:number, n: number, transforms) {
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

var io = socket.connect(window.location.href);

class GameUI extends React.Component<{}, {}> {
  render() {
    return (
      <nav className="navbar navbar-default navbar-inverse navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Math4Me</a>
          </div>
        </div>
      </nav>);
  }
}

ReactDOM.render(
  <GameUI/>,
  document.getElementById("container")
);
