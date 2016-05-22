import * as React from "react";
import {ClientGame} from "../clientGame";
import {UserList} from "./UserList";

interface Props {
  game: ClientGame;
  handler: (string, any) => {}
}

export class StartedLobbyScreen extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    let liGroup = null;
    if (this.props.game.users) {
      liGroup = <UserList users={this.props.game.users} currentUser={this.props.game.user}/>
    }
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Game Controls</h3>
            </div>
            <div className="panel-body">
              <p>
                Link to share: {this.props.game.getLink()}
              </p>
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
              {liGroup}
            </div>
          </div>
        </div>
      </div>
    );
  }
}