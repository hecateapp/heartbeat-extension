import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { observer, inject } from "mobx-react";
import PullRequestStore from "../../stores/PullRequestStore";
import RatingForm from "./RatingForm";
import ErrorNotice from "./ErrorNotice";
import { withStyles } from "@material-ui/core";

const Dialog = withStyles({
  root: {
    maxWidth: "400px",
    marginRight: "1em"
  }
})(Paper);

interface IRatingDialogProps {
  pullRequestStore?: PullRequestStore;
}

class RatingDialog extends React.Component<IRatingDialogProps> {
  public render() {
    if (!this.props.pullRequestStore) {
      return null;
    }

    if (this.props.pullRequestStore.isModalOpen) {
      return (
        <Dialog
          elevation={12}
        >
          {this.props.pullRequestStore!.authError ? (
            <ErrorNotice />
          ) : (
            <RatingForm />
          )}
        </Dialog>
      );
    }

    return null;
  }
}

export default inject("pullRequestStore")(observer(RatingDialog));
