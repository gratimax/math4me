import * as React from "react";
import {ClientGame} from "../clientGame";
import User from "../../user";

interface Props {
  game: ClientGame;
  handler: (string, any) => {}
}

class UserDisplay extends React.Component<{user: User}, {}> {
  constructor(props: {user: User}) {
    super(props);
  }
  render() {
    return <li className="list-group-item">{this.props.user.name}</li>;
  }
}

export class StartedLobbyScreen extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  select(event) {
    event.target.select();
  }

  render() {
    let liGroup = null;
    if (this.props.game.users) {
      liGroup = <ul className="list-group">
        {this.props.game.users.map((user) => {
          return <UserDisplay key={user.id} user={user}/>
        })}
      </ul>;
    }
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Game Controls</h3>
            </div>
            <div className="panel-body">
              Link to share: <input type="text" onClick={this.select} defaultValue={this.props.game.getLink()} />
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
              {liGroup}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
