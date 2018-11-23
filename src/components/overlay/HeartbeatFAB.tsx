import * as React from "react";
import { SFC } from "react";

import Button from "@material-ui/core/Button";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import { Badge, withStyles } from "@material-ui/core";
import PullRequestStore from "../../stores/PullRequestStore";
import { inject, observer } from "mobx-react";

const FAB = withStyles({
  root: {
    margin: "1em"
  }
})(Button);

const HeartbeatFAB: SFC<{
  onClick: (
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  pullRequestStore?: PullRequestStore;
}> = ({ onClick, pullRequestStore }) => {
  let icon = <FavoriteBorderIcon fontSize="large" />;
  if (pullRequestStore) {
    if (pullRequestStore.authError) {
      icon = <Badge badgeContent={"!"} color="secondary">{icon}</Badge>
    } else if (pullRequestStore.requestInProgress) {
      icon = <Badge badgeContent={"♻"} color="secondary">{icon}</Badge>
    } else if (pullRequestStore.serverRating) {
      icon = <Badge badgeContent={"✅"} color="secondary">{icon}</Badge>
    }
  }
  return (
    <FAB variant="fab" color="primary" onClick={onClick}>
      {icon}
    </FAB>
  );
};

export default inject("pullRequestStore")(observer(HeartbeatFAB));
