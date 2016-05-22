import * as React from "react";

import {ClientGame, GameStage} from "./clientGame";
import {RejectedGameScreen} from "./ui/RejectedGameScreen";
import {PromptNameGameScreen} from "./ui/PromptNameGameScreen";
import {WaitingGameScreen} from "./ui/WaitingGameScreen";
import {StartedLobbyScreen} from "./ui/StartedLobbyScreen";
import {ProblemScreen} from "./ui/ProblemScreen";

interface Props {
  game: ClientGame;
  handler: (string, any) => {}
}

export class GameUI extends React.Component<Props, {}> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    console.log(this.props.game instanceof ClientGame);
    let screen = null;
    let s = this.props.game.stage;
    if (s instanceof GameStage.JoinGameFailed) {
      let stage = s as GameStage.JoinGameFailed;
      screen = <RejectedGameScreen reason={stage.reason}/>;
    } else if (s instanceof GameStage.PromptingForName) {
      screen = <PromptNameGameScreen handler={this.props.handler}/>;
    } else if (s instanceof GameStage.Waiting) {
      let stage = s as GameStage.Waiting;
      screen = <WaitingGameScreen message={stage.message}/>;
    } else if (s instanceof GameStage.StartedLobby) {
      screen = <StartedLobbyScreen handler={this.props.handler} game={this.props.game} mainUser={true}/>;
    } else if (s instanceof GameStage.WaitingLobby) {
      screen = <StartedLobbyScreen handler={this.props.handler} game={this.props.game} mainUser={false}/>;
    } else if (s instanceof GameStage.DoingProblem) {
      let stage = s as GameStage.DoingProblem;
      screen = <ProblemScreen handler={this.props.handler} game={this.props.game} problem={stage.problem}/>;
    }
    return (
      <div>
        <nav className="navbar navbar-default navbar-inverse navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">Math4Me</a>
            </div>
          </div>
        </nav>
        <div className="container">
          {screen}
        </div>
      </div>
    );
  }
}