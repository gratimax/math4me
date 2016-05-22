import * as React from "react";
import User from "../../user";

const e = 0.1;

function eequal(x: number, y: number) {
  return Math.abs(x - y) <= e;
}

interface DisplayProps {
  user: User;
  currentUser: User;
  displayScore: boolean;
  displayCrown: boolean;
  gotIt: boolean;
  currentValue: string;
}

class UserDisplay extends React.Component<DisplayProps, {}> {
  constructor(props: DisplayProps) {
    super(props);
  }
  render() {
    let you = null;
    if (this.props.user == this.props.currentUser) {
      you = <strong>(you)</strong>;
    }
    let score = null;
    if (this.props.displayScore) {
      score = <span className="pull-right text-muted">{this.props.user.score.toFixed(1)} points</span>
    }
    let crown = null;
    if (this.props.displayCrown) {
      crown = <span className="winner">
        <i className="glyphicon glyphicon-sunglasses"></i> (#1!)
      </span>;
    }
    let userHead = <span>{this.props.user.name} {you}</span>;
    if (this.props.gotIt) {
      userHead = <em className="text-success">{userHead} (answered)</em>
    }
    let curValue = null;
    if (this.props.currentValue) {
      curValue = <span className="pull-right text-info">[at {this.props.currentValue}]&nbsp;&nbsp;</span>;
    }
    return <li className="list-group-item">{userHead} {crown} {score} {curValue} </li>;
  }
}

interface ListProps {
  users: Array<User>;
  whoGotIt: Array<number>;
  currentValues: {[id: number]: string};
  currentUser: User;
  displayScore: boolean;
  displayCrown: boolean;
}

export class UserList extends React.Component<ListProps, {}> {
  constructor(props: ListProps) {
    super(props);
  }
  render() {
    let crownIds = [];
    if (this.props.displayCrown) {
      let top = this.props.users[0].score;
      this.props.users.forEach((user) => {
        if (eequal(user.score, top)) {
          crownIds.push(user.id);
        }
      })
    }
    return <ul className="list-group">
      {this.props.users.map((user) => {
        return <UserDisplay key={user.id} user={user} currentUser={this.props.currentUser} displayScore={this.props.displayScore}
          displayCrown={crownIds.indexOf(user.id) != -1} gotIt={this.props.whoGotIt.indexOf(user.id) != -1}
                            currentValue={this.props.currentValues[user.id]}/>
      })}
    </ul>;
  }
}