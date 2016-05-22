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
      crown = <i className="glyphicon glyphicon-sunglasses" style={{color: "gold"}}></i>;
    }
    return <li className="list-group-item">{this.props.user.name} {you} {crown} {score}</li>;
  }
}

interface ListProps {
  users: Array<User>;
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
    console.log(crownIds);
    return <ul className="list-group">
      {this.props.users.map((user) => {
        return <UserDisplay key={user.id} user={user} currentUser={this.props.currentUser} displayScore={this.props.displayScore}
          displayCrown={crownIds.indexOf(user.id) != -1}/>
      })}
    </ul>;
  }
}