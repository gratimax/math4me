import * as React from "react";

import * as GameRole from "../gameRole";

interface GameUIState {
  gameRole: GameRole.GameRole
  name: String
}

export default class GameUI extends React.Component<{}, GameUIState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      gameRole: GameRole.create(),
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-inverse navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">Math4Me</a>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}