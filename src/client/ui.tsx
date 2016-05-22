import * as React from "react";

import {ClientGame, GameStage} from "./clientGame";
import {RejectedGameScreen} from "./ui/RejectedGameScreen";

interface Props {
  game: ClientGame,
  handler: (string, any) => {}
}

export class GameUI extends React.Component<Props, {}> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    let sub = null;
    if (this.props.game.stage instanceof GameStage.JoinGameFailed) {
      let stage = this.props.game.stage as GameStage.JoinGameFailed;
      sub = <RejectedGameScreen reason={stage.reason}/>;
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
        {sub}
      </div>
    );
  }
}