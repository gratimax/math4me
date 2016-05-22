import * as React from "react";

interface Props {
  totalSeconds: number
}

interface State {
  secondsRemaining: number
  counter: any
}

export class TimeProgress extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      secondsRemaining: props.totalSeconds,
      counter: null
    }
  }

  componentDidMount() {
    this.state.counter = setInterval(() => {
      this.state.secondsRemaining--;
      this.forceUpdate();
    }, 1 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.state.counter);
  }

  getProgressWidth() {
    return `${this.state.secondsRemaining/(this.props.totalSeconds) * 100}%`;
  }

  render() {
    return <div className="progress">
      <div className="progress-bar" style={{width: this.getProgressWidth()}}>
        {this.state.secondsRemaining}s
      </div>
    </div>;
  }
}