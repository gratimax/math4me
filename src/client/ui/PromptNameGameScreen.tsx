import * as React from "react";

export class PromptNameGameScreen extends React.Component<{handler:(string, any) => {}}, {errors:string}> {
  constructor(props:{handler:(string, any) => {}}) {
    super(props);

    this.state = {errors: null};
  }

  submit(evt) {
    evt.preventDefault();
    let name = (this.refs['username'] as HTMLInputElement).value;
    if (name) {
      this.props.handler('gotName', name);
    } else {
      this.setState({errors: "Put <em>anything</em> as your username, come on!"});
    }
  }

  clearErrors() {
    this.setState({errors: null});
  }

  render() {
    let hasErrors = this.state.errors != null;
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Input username</h3>
            </div>
            <div className="panel-body">
              <form onSubmit={this.submit.bind(this)}>
                <div className={"form-group"+(hasErrors?" has-error":"")}>
                  <input type="text" className="form-control"
                         placeholder="Username" ref="username"
                         onChange={this.clearErrors.bind(this)}/>
                  {hasErrors ?
                    <span className="help-block"
                          dangerouslySetInnerHTML={{__html: this.state.errors}}>
                </span>
                    : null}
                </div>
                <button type="submit" className="btn btn-default">Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}