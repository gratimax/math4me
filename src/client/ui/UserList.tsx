import * as React from "react";
import User from "../../user";

class UserDisplay extends React.Component<{user: User, currentUser: User}, {}> {
  constructor(props: {user: User, currentUser: User}) {
    super(props);
  }
  render() {
    let you = null;
    if (this.props.user == this.props.currentUser) {
      you = <strong>(you)</strong>;
    }
    return <li className="list-group-item">{this.props.user.name} {you}</li>;
  }
}

export class UserList extends React.Component<{users: Array<User>, currentUser: User}, {}> {
  constructor(props: {users: Array<User>, currentUser: User}) {
    super(props);
  }
  render() {
    return <ul className="list-group">
      {this.props.users.map((user) => {
        return <UserDisplay key={user.id} user={user} currentUser={this.props.currentUser}/>
      })}
    </ul>;
  }
}