import {Game} from "./game";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socket from "socket.io-client";

var io = socket.connect(window.location.href);

ReactDOM.render(
  <h1>
    Hey!
  </h1>,
  document.getElementById("container")
);
