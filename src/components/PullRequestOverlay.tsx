import * as React from "react";
import { inject, observer } from "mobx-react";

import PullRequestStore from "../stores/PullRequestStore";

interface IPullRequestOverlayProps {
  pullRequestStore?: PullRequestStore;
}

class PullRequestOverlay extends React.Component<IPullRequestOverlayProps> {

  render() {
    if (!this.props.pullRequestStore || !this.props.pullRequestStore.prPath) {
      return null;
    }

    return (
      <React.Fragment>Hello</React.Fragment>
    );
  }
}

export default inject("pullRequestStore")(observer(PullRequestOverlay));
