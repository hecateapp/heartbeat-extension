import * as React from "react";
import { inject, observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import styled from "styled-components";

import PullRequestStore from "../stores/PullRequestStore";

interface IPullRequestOverlayProps {
  pullRequestStore?: PullRequestStore;
}

const HeartbeatFAB = styled(Button)`
  margin: 1em;
`;

class PullRequestOverlay extends React.Component<IPullRequestOverlayProps> {
  render() {
    if (!this.props.pullRequestStore || !this.props.pullRequestStore.prPath) {
      return null;
    }

    return (
      <HeartbeatFAB variant="fab">
        <FavoriteBorderIcon />
      </HeartbeatFAB>
    );
  }
}

export default inject("pullRequestStore")(observer(PullRequestOverlay));
