import * as React from "react";

import { logView } from "../util/api";

interface IPullRequestOverlayProps {
  prPath: string;
}

class PullRequestOverlay extends React.Component<IPullRequestOverlayProps> {
  componentDidMount() {
    logView(this.props.prPath).then(r => console.log(r));
  }

  render() {
    return <h1 style={{ color: "red" }}>{this.props.prPath}</h1>;
  }
}

export default PullRequestOverlay;
