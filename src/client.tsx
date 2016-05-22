import {Game} from "./game";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socket from "socket.io-client";

let math = require("mathjs");
math.config({
  number: 'Fraction'
});

let io = socket.connect(window.location.href);

class GameUI extends React.Component<{}, {}> {
  render() {
    return (
      <nav className="navbar navbar-default navbar-inverse navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Math4Me</a>
          </div>
        </div>
      </nav>
    );
  }
}

ReactDOM.render(
  <GameUI/>,
  document.getElementById("container")
);
