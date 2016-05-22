import * as React from "react";
import {ClientGame} from "../clientGame";

interface Props {
  game: ClientGame;
  handler: (string, any) => {}
}

export class StartedLobbyScreen extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    console.log(this.props.game);
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Game Controls</h3>
            </div>
            <div className="panel-body">
              Link to share: {this.props.game.getLink()}
              <br/>
              <button className="btn btn-primary">Start Game</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Users</h3>
            </div>
            <div className="panel-body">
              <button className="btn btn-primary">Start Game</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}