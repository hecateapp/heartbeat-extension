import React from "react";
import { inject, observer } from "mobx-react";

import HeartbeatFAB from "./overlay/HeartbeatFAB";

import PullRequestStore from "../stores/PullRequestStore";
import RatingDialog from "./overlay/RatingDialog";

interface IPullRequestOverlayProps {
  pullRequestStore?: PullRequestStore;
}

class PullRequestOverlay extends React.Component<IPullRequestOverlayProps> {
  public render() {
    if (!this.props.pullRequestStore || !this.props.pullRequestStore.prPath) {
      return null;
    }

    return (
      <div
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "flex-end"
        }}
      >
        <RatingDialog />
        <HeartbeatFAB onClick={this.props.pullRequestStore.toggleModal} />
      </div>
    );
  }

  public componentDidCatch(error: Error | null, info: any) {
    if (this.props.pullRequestStore) {
      this.props.pullRequestStore.notifyError(error, info);
    }
  }
}

export default inject("pullRequestStore")(observer(PullRequestOverlay));
