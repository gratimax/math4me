import * as React from "react";

export default class GameUI extends React.Component<{}, {}> {
  render() {
    return (
      <nav className="navbar navbar-default navbar-inverse navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Math4Me</a>
          </div>
        </div>
      </nav>
    );
  }
}