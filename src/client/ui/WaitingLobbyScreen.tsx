import * as React from "react";
import {ClientGame} from "../clientGame";
import {UserList} from "./UserList";

export class WaitingLobbyScreen extends React.Component<{game:ClientGame}, {}> {
  constructor(props: {game:ClientGame}) {
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
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title">Game Lobby</h3>
            </div>
            <div className="panel-body">
              Game waiting to start...
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