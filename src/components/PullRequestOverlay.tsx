import * as React from "react";
import { Fragment } from "react";
import { inject, observer } from "mobx-react";

import HeartbeatFAB from "./overlay/HeartbeatFAB";

import PullRequestStore from "../stores/PullRequestStore";
import RatingDialog from "./overlay/RatingDialog";

interface IPullRequestOverlayProps {
  pullRequestStore?: PullRequestStore;
}

interface IPullRequestOverlayState {
  open: boolean;
}


class PullRequestOverlay extends React.Component<IPullRequestOverlayProps, IPullRequestOverlayState> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
    }
  }
  private showDialog = () : void => {
    this.setState({open: true});
  }

  private hideDialog = () : void => {
    this.setState({open: false});
  }

  public render() {
    if (!this.props.pullRequestStore || !this.props.pullRequestStore.prPath) {
      return null;
    }

    return (
      <Fragment>
        <RatingDialog open={this.state.open} close={this.hideDialog} />
        <HeartbeatFAB onClick={this.showDialog} />
      </Fragment>
    );
  }
}

export default inject("pullRequestStore")(observer(PullRequestOverlay));
