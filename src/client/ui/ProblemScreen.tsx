import * as React from "react";
var math = require('mathjs');

import {ClientGame} from "../clientGame";
import {UserList} from "./UserList";
import {ClientProblem} from "../clientProblem";

import * as constants from "../../constants";
import {TimeProgress} from "./TimeProgress";

math.config({
  number: 'Fraction'
});

interface Props {
  game: ClientGame;
  problem: ClientProblem;
  handler: (string, any) => {}
}

interface State {
  kept: Array<{id: number, value: number}|string>,
  numberIdsUsed: Array<number>
}

class Op extends React.Component<{handler: any, op: string}, {}> {
  constructor(props: {handler: any, op: string}) {
    super(props);
  }

  render() {
    return <button className="btn btn-success" onClick={this.props.handler}>{this.props.op}</button>;
  }
}

class Num extends React.Component<{handler: any, num: number, disabled: boolean}, {}> {
  constructor(props: {handler: any, num: number, disabled: boolean}) {
    super(props);
  }

  render() {
    return <button className="btn btn-primary" onClick={this.props.handler} disabled={this.props.disabled}>
      {this.props.num}
    </button>;
  }
}

export class ProblemScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.initialState();
  }

  initialState(): State {
    let obj = {
      kept: [],
      numberIdsUsed: []
    };
    return obj;
  }

  pressedOp(name: string) {
    this.state.kept.push(name);
    this.forceUpdate();
  }

  pressedNum(id: number, num: number) {
    this.state.kept.push({id: id, value: num});
    this.state.numberIdsUsed.push(id);
    this.forceUpdate();
  }

  static getFracString(frac: any): String {
    var s = frac.s == 1 ? "" : "-";
    if (frac.d == 1)
      return s+frac.n.toString();
    else
      return s+frac.n.toString()+"/"+frac.d.toString();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.problem.problemNumber != this.props.problem.problemNumber) {
      this.setState(this.initialState());
    }
  }

  del() {
    let thing = this.state.kept.pop();
    if (typeof thing != "string") {
      let thingId = (thing as any).id;
      this.state.numberIdsUsed = this.state.numberIdsUsed.filter((id) => {
        return id != thingId;
      });
    }
    this.forceUpdate();
  }

  clear() {
    this.state.kept = [];
    this.state.numberIdsUsed = [];
    this.forceUpdate();
  }

  keptSanitized() {
    return this.state.kept.map((thing) => {
      if (typeof thing == "string") {
        return thing;
      } else {
        return (thing as any).value;
      }
    });
  }

  eval() {
    if (this.state.kept.length > 0) {
      try {
        let expr = this.keptSanitized().join('');
        this.props.handler('haveExpr', expr);
        return ProblemScreen.getFracString(math.eval(expr));
      } catch (e) {
        return "";
      }
    } else {
      return "";
    }
  }

  render() {
    let liGroup = null;
    if (this.props.game.users) {
      liGroup = <UserList users={this.props.game.users} currentUser={this.props.game.user} displayScore={true}
        displayCrown={false}/>
    }
    let problem = this.props.problem;
    let ops = ['('].concat(problem.ops).concat([')']);
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Problem {problem.problemNumber}/{this.props.game.totalProblems}</h3>
            </div>
            <div className="panel-body">
              <p>
                Goal: {problem.goal}
              </p>
              <TimeProgress totalSeconds={constants.NUM_SECONDS_GIVEN}/>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="panel panel-primary">
            <div className="panel-body">
              <p>
                Expression: {this.keptSanitized().join(' ')}
              </p>
              <p>
                Value: {this.eval()}
              </p>
              <br/>
              <div className="btn-group">
                <button className="btn btn-warning" onClick={this.del.bind(this)}>Del</button>
                <button className="btn btn-error" onClick={this.clear.bind(this)}>Clear</button>
              </div>
              <br/>
              <div className="btn-group">
                {ops.map((op, index) => {
                  return <Op key={index} op={op} handler={this.pressedOp.bind(this, op)}/>
                })}
              </div>
              <br/>
              <div className="btn-group">
                {problem.given.map((num, index) => {
                  let disabled = this.state.numberIdsUsed.indexOf(index) != -1;
                  return <Num key={index} num={num} handler={this.pressedNum.bind(this,index, num)} disabled={disabled}/>
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