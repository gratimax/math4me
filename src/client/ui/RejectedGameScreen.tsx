import * as React from "react";

export class RejectedGameScreen extends React.Component<{reason: String}, {}> {
  render() {
    return (
      <div className="col-ms-4 col-ms-offset-4">
        <div className="panel panel-danger">
          <div className="panel-heading">
            <h3 className="panel-title">Could not join game</h3>
          </div>
          <div className="panel-body">
            {this.props.reason}
          </div>
        </div>
      </div>
    );
  }
}