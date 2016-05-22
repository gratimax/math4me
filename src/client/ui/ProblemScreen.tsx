import * as React from "react";
import {ClientGame} from "../clientGame";
import {UserList} from "./UserList";
import {ClientProblem} from "../clientProblem";

interface Props {
  game: ClientGame;
  problem: ClientProblem;
  handler: (string, any) => {}
}

class Op extends React.Component<{handler: (string, any) => {}, op: string}, {}> {
  constructor(props: {handler: (string, any) => {}, op: string}) {
    super(props);
  }

  render() {
    return <button className="btn btn-success">{this.props.op}</button>;
  }
}

class Num extends React.Component<{handler: (string, any) => {}, num: number}, {}> {
  constructor(props: {handler: (string, any) => {}, num: number}) {
    super(props);
  }

  render() {
    return <button className="btn btn-primary">{this.props.num}</button>;
  }
}

export class ProblemScreen extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  startGame() {
    this.props.handler('startGame', {});
  }

  render() {
    let liGroup = null;
    if (this.props.game.users) {
      liGroup = <UserList users={this.props.game.users} currentUser={this.props.game.user}/>
    }
    let problem = this.props.problem;
    let ops = ['('].concat(problem.ops).concat([')']);
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
          <div className="panel panel-primary">
            <div className="panel-body">
              <div className="btn-group">
                {ops.map((op) => {
                  return <Op op={op} handler={this.props.handler}/>
                })}
              </div>
              <div className="btn-group">
                {problem.given.map((num) => {
                  return <Num num={num} handler={this.props.handler}/>
                })}
              </div>
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
