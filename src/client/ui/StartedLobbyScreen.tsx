import * as React from "react";
import {ClientGame} from "../clientGame";
import {UserList} from "./UserList";
import {GameSettings} from "../../settings";

interface Props {
  game: ClientGame;
  handler: (string, any) => {}
  mainUser: boolean
  settings: GameSettings;
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

  updateSettings() {
    let settings = new GameSettings();
    settings.numGivenNumbers = (this.refs["numGivenNumbers"] as any).value;
    settings.maxOption = (this.refs["maxOption"] as any).value;
    settings.enableDivision = !!(this.refs["enableDivision"] as any).checked;
    settings.secondsEachProblem = (this.refs["secondsEachProblem"] as any).value;
    settings.numProblems = (this.refs["numProblems"] as any).value;
    this.props.handler('updateSettings', settings);
  }

  render() {
    let liGroup = null;
    if (this.props.game.users) {
      liGroup = <UserList users={this.props.game.users} currentUser={this.props.game.user} displayScore={false}
        displayCrown={false} whoGotIt={[]} currentValues={{}}/>
    }
    let startGame = null;
    if (this.props.mainUser) {
      startGame = <button className="btn btn-primary" onClick={this.startGame.bind(this)}>Start Game</button>;
    }
    let settingsPanel;
    if (this.props.mainUser) {
      let settings = this.props.settings;
      settingsPanel =
        <form onChange={this.updateSettings.bind(this)}>
          <div className="form-group">
            <label>Number of options per problem: {settings.numGivenNumbers}</label>
            <input type="range" min="1" max="10" step="1" ref="numGivenNumbers" value={settings.numGivenNumbers}/>
          </div>
          <div className="form-group">
            <label>Maximum number of option: {settings.maxOption}</label>
            <input type="range" min="1" max="20" step="1" ref="maxOption" value={settings.maxOption}/>
          </div>
          <div className="form-group">
            <label>Enable division:&nbsp;</label>
            <input type="checkbox" ref="enableDivision" checked={settings.enableDivision?"checked":null}
                   onClick={this.updateSettings.bind(this)}/>
            {settings.enableDivision?"yes":"no"}
          </div>
          <div className="form-group">
            <label>Time for each problem: {settings.secondsEachProblem} seconds</label>
            <input type="range" min="1" max="45" step="1" ref="secondsEachProblem" value={settings.secondsEachProblem}/>
          </div>
          <div className="form-group">
            <label>Total number of problems: {settings.numProblems}</label>
            <input type="range" min="1" max="20" step="1" ref="numProblems" value={settings.numProblems}/>
          </div>
        </form>;
    } else {
      let settings = this.props.settings;
      settingsPanel = <ul className="list-item-group no-margin-left">
        <li className="list-group-item">Number of options per problem: {settings.numGivenNumbers}</li>
        <li className="list-group-item">Maximum number of option: {settings.maxOption}</li>
        <li className="list-group-item">Enable division: {settings.enableDivision?"yes":"no"}</li>
        <li className="list-group-item">Time for each problem: {settings.secondsEachProblem} seconds</li>
        <li className="list-group-item">Total number of problems: {settings.numProblems}</li>
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
              <p>
                Link to share: <input type="text" onClick={this.select} defaultValue={this.props.game.getLink()} />
              </p>
              {settingsPanel}
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
