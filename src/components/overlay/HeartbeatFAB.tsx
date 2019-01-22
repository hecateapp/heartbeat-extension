import * as React from "react";
import { SFC } from "react";

import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import PullRequestStore from "../../stores/PullRequestStore";
import { inject, observer } from "mobx-react";

const FAB = withStyles({
  root: {
    margin: "1em"
  }
})(Button);

interface IHeartbeatFABProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  pullRequestStore?: PullRequestStore;
}

class HeartbeatFAB extends React.Component<IHeartbeatFABProps> {
  render() {
    if (!this.props.pullRequestStore) {
      return null;
    }

    let icon = <FavoriteBorderIcon fontSize="large" />;

    if (
      this.props.pullRequestStore.authError ||
      this.props.pullRequestStore.requestError
    ) {
      icon = (
        <Badge badgeContent={"!"} color="secondary">
          {icon}
        </Badge>
      );
    } else if (this.props.pullRequestStore.requestInProgress) {
      icon = (
        <Badge badgeContent={"♻"} color="secondary">
          {icon}
        </Badge>
      );
    } else if (this.props.pullRequestStore.serverRating) {
      icon = (
        <Badge badgeContent={"✅"} color="secondary">
          {icon}
        </Badge>
      );
    }

    return (
      <FAB variant="fab" color="primary" onClick={this.props.onClick}>
        {icon}
      </FAB>
    );
  }
}

export default inject("pullRequestStore")(observer(HeartbeatFAB));
