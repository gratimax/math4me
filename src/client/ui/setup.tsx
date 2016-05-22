import * as React from "react";
import * as ReactDOM from "react-dom";
import {StartingState} from "../startingState";
import GameUI from "./GameUI";

export default function setupUI(starting: StartingState) {
  ReactDOM.render(
    <GameUI startingState={starting}/>,
    document.getElementById("container")
  );
  console.log("ui setup");
}