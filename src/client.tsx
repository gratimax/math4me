import {Game} from "./game";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socket from "socket.io-client";

var io = socket.connect(window.location.href);

class Hello extends React.Component<any, {}> {
  wow(event) {
    alert(this.props.to);
  }
  render() {
    return <h1 onClick={(evt) => this.wow(evt)}>Hello, {this.props.to}!</h1>;
  }
}

ReactDOM.render(
  <Hello to="Tom"/>,
  document.getElementById("container")
);
