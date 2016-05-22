import * as React from "react";

import {ClientGame, GameStage} from "./clientGame";
import {RejectedGameScreen} from "./ui/RejectedGameScreen";
import {PromptNameGameScreen} from "./ui/PromptNameGameScreen";
import {WaitingGameScreen} from "./ui/WaitingGameScreen";
import {StartedLobbyScreen} from "./ui/StartedLobbyScreen";
import {ProblemScreen} from "./ui/ProblemScreen";
import {AnswerScreen} from "./ui/AnswerScreen";
import {GameFinishScreen} from "./ui/GameFinishScreen";
import {GameSettings} from "../settings";

interface Props {
  game: ClientGame;
  handler: (string, any) => {};
}

export class GameUI extends React.Component<Props, {}> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    let screen = null;
    let s = this.props.game.stage;
    if (s instanceof GameStage.JoinGameFailed) {
      let stage = s as GameStage.JoinGameFailed;
      screen = <RejectedGameScreen reason={stage.reason}/>;
    } else if (s instanceof GameStage.PromptingForName) {
      screen = <PromptNameGameScreen handler={this.props.handler} gameRole={this.props.game.role}/>;
    } else if (s instanceof GameStage.Waiting) {
      let stage = s as GameStage.Waiting;
      screen = <WaitingGameScreen message={stage.message}/>;
    } else if (s instanceof GameStage.StartedLobby) {
      let stage = s as GameStage.StartedLobby;
      screen = <StartedLobbyScreen handler={this.props.handler} game={this.props.game} mainUser={true}
        settings={stage.settings}/>;
    } else if (s instanceof GameStage.WaitingLobby) {
      let stage = s as GameStage.WaitingLobby;
      screen = <StartedLobbyScreen handler={this.props.handler} game={this.props.game} mainUser={false}
        settings={stage.settings}/>;
    } else if (s instanceof GameStage.DoingProblem) {
      let stage = s as GameStage.DoingProblem;
      screen = <ProblemScreen handler={this.props.handler} game={this.props.game} problem={stage.problem}/>;
    } else if (s instanceof GameStage.AnswerProblem) {
      let stage = s as GameStage.AnswerProblem;
      screen = <AnswerScreen game={this.props.game} problem={stage.problem} answer={stage.answer}/>
    } else if (s instanceof GameStage.FinishedGame) {
      screen = <GameFinishScreen game={this.props.game}/>
    }
    return (
      <div>
        <nav className="navbar navbar-default navbar-inverse navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="/"><img src="/logo.png" className="logo"/></a>
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