import * as React from "react";
import {ClientGame} from "../clientGame";
import {UserList} from "./UserList";

interface Props {
  game: ClientGame;
  handler: (string, any) => {}
  mainUser: boolean
}

export class StartedLobbyScreen extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  select(event) {
    event.target.select();
  }

  startGame() {
    this.props.handler('startGame', {});
  }

  render() {
    let liGroup = null;
    if (this.props.game.users) {
      liGroup = <UserList users={this.props.game.users} currentUser={this.props.game.user} displayScore={false}
        displayCrown={false}/>
    }
    let startGame = null;
    if (this.props.mainUser) {
      startGame = <button className="btn btn-primary" onClick={this.startGame.bind(this)}>Start Game</button>;
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
                Link to share: <input type="text" onClick={this.select} defaultValue={this.props.game.getLink()} />
              </p>
              {startGame}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title">Game Lobby</h3>
            </div>
            <div className="panel-body">
              Waiting for game to start...
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
