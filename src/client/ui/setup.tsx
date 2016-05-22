import * as React from "react";
import * as ReactDOM from "react-dom";
import GameUI from "./GameUI";

export default function setupUI() {
  ReactDOM.render(
    <GameUI/>,
    document.getElementById("container")
  );
  console.log("ui setup");
}