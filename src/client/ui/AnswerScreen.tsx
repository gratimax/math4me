import * as React from "react";
import {ClientGame} from "../clientGame";
import {UserList} from "./UserList";
import {ClientProblem} from "../clientProblem";
var math = require('mathjs');
math.config({
  number: 'Fraction'
});

interface Props {
  game: ClientGame;
  problem: ClientProblem;
  answer: String
}

export class AnswerScreen extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    let liGroup = null;
    if (this.props.game.users) {
      liGroup = <UserList users={this.props.game.users} currentUser={this.props.game.user} displayScore={true}/>
    }
    let problem = this.props.problem;
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Problem</h3>
            </div>
            <div className="panel-body">
              <p>
                Goal: {problem.goal}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="panel panel-success">
            <div className="panel-heading">
              <h3 className="panel-title">Answer</h3>
            </div>
            <div className="panel-body">
              {this.props.answer}
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
