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
  expr: Array<{id: number, value: number}|string>,
  numberIdsUsed: Array<number>,
  prevExpr: string,
  prevEval: any,
  parens: number
}

class Op extends React.Component<{handler: any, op: string, disabled: boolean}, {}> {
  constructor(props: {handler: any, op: string, disabled: boolean}) {
    super(props);
  }

  render() {
    return <button className="btn btn-success" onClick={this.props.handler} disabled={this.props.disabled}>{this.props.op}</button>;
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
      expr: [],
      prevExpr: '',
      prevEval: null,
      numberIdsUsed: [],
      parens: 0
    };
    return obj;
  }

  pressedOp(name: string) {
    if(name == "(")
      this.state.parens++;
    if(name == ")")
      this.state.parens--;
    this.state.expr.push(name);
    this.forceUpdate();
  }

  pressedNum(id: number, num: number) {
    var last = this.state.expr.length == 0 ? null : this.state.expr[this.state.expr.length-1];
    if (last == null || (typeof last == "string" && last != ")")) {
      this.state.expr.push({id: id, value: num});
      this.state.numberIdsUsed.push(id);
      this.forceUpdate();
    }
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
    let thing = this.state.expr.pop();
    if (typeof thing != "string") {
      let thingId = (thing as any).id;
      this.state.numberIdsUsed = this.state.numberIdsUsed.filter((id) => {
        return id != thingId;
      });
    }
    this.forceUpdate();
  }

  clear() {
    this.state.expr = [];
    this.state.numberIdsUsed = [];
    this.forceUpdate();
  }

  exprSanitized() {
    return this.state.expr.map((thing) => {
      if (typeof thing == "string") {
        return thing;
      } else {
        return (thing as any).value;
      }
    });
  }

  eval() {
    if (this.state.expr.length > 0) {
      try {
        let expr = this.exprSanitized().join(' ');
        if (expr != this.state.prevExpr) {
          this.props.handler('haveExpr', expr);
          this.state.prevExpr = expr;
          this.state.prevEval = math.eval(expr);
          return ProblemScreen.getFracString(this.state.prevEval);
        } else {
          return ProblemScreen.getFracString(this.state.prevEval);
        }
      } catch (e) {
        return "?";
      }
    } else {
      return "?";
    }
  }

  render() {
    let problem = this.props.problem;
    let liGroup = null;
    if (this.props.game.users) {
      liGroup = <UserList users={this.props.game.users} currentUser={this.props.game.user} displayScore={true}
        displayCrown={false} whoGotIt={problem.whoGotIt} currentValues={problem.currentValues}/>
    }
    let ops = ['('].concat(problem.ops).concat([')']);
    let didISolveIt = problem.whoGotIt.indexOf(this.props.game.user.id) != -1;
    let calculator = null;
    if (!didISolveIt) {
      calculator = <div className="buttons">
        <br/>
        <div className="btn-group btn-group-lg">
          <button className="btn btn-warning" onClick={this.del.bind(this)}>Del</button>
          <button className="btn btn-error" onClick={this.clear.bind(this)}>Clear</button>
        </div>
        <br/>
        <div className="btn-group btn-group-lg">
          {ops.map((op, index) => {
            var last = this.state.expr.length == 0 ? null : this.state.expr[this.state.expr.length-1];
            var disabled = (op == "(" && last != null && (typeof last != "string" || last == ")")) ||
                           (op == ")" && ((typeof last == "string" && last != ")") || this.state.parens == 0)) ||
                           (op != "(" && op != ")" && (last == null || (typeof last == "string" && last != ")")));
            return <Op key={index} op={op} handler={this.pressedOp.bind(this, op)} disabled={disabled}/>
          })}
        </div>
        <br/>
        <div className="btn-group btn-group-lg">
          {problem.given.map((num, index) => {
            let disabled = this.state.numberIdsUsed.indexOf(index) != -1;
            return <Num key={index} num={num} handler={this.pressedNum.bind(this,index, num)} disabled={disabled}/>
          })}
        </div>
      </div>;
    }
    let niceJob = null;
    if (didISolveIt) {
      niceJob =
        <div className="panel-heading">
          <h3 className="panel-title">Nice job!</h3>
        </div>;
    }
    let panelOtherClass = (didISolveIt) ? " panel-success" : " panel-default";
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Problem {problem.problemNumber}/{this.props.game.totalProblems}</h3>
            </div>
            <div className="panel-body">
              <h3 className="no-padding-top">
                Goal: {problem.goal}
              </h3>
              <TimeProgress totalSeconds={this.props.game.timeGiven}/>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={"panel"+panelOtherClass}>
            {niceJob}
            <div className="panel-body">
              <p>
                <span className="calculator">{this.exprSanitized().join(' ') || "?"} => {this.eval()}</span>
              </p>
              {calculator}
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
