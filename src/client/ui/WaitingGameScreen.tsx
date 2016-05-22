import * as React from "react";

export class WaitingGameScreen extends React.Component<{message: String}, {}> {
  render() {
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title">Please hold tight...</h3>
            </div>
            <div className="panel-body">
              {this.props.message}
              <br/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}