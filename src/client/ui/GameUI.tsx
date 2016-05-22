import * as React from "react";

import {StartingState} from "../startingState";

interface GameUIProps {
  startingState: StartingState
}

export default class GameUI extends React.Component<GameUIProps, {}> {
  componentMount()
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