import * as React from "react";
import User from "../../user";

interface DisplayProps {
  user: User;
  currentUser: User;
  displayScore: boolean;
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
      score = <span className="pull-right text-muted">{this.props.user.score} points</span>
    }
    return <li className="list-group-item">{this.props.user.name} {you} {score}</li>;
  }
}

interface ListProps {
  users: Array<User>;
  currentUser: User;
  displayScore: boolean;
}

export class UserList extends React.Component<ListProps, {}> {
  constructor(props: ListProps) {
    super(props);
  }
  render() {
    return <ul className="list-group">
      {this.props.users.map((user) => {
        return <UserDisplay key={user.id} user={user} currentUser={this.props.currentUser} displayScore={this.props.displayScore}/>
      })}
    </ul>;
  }
}