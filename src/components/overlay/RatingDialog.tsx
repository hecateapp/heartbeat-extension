import React from "react";
import Paper from "@material-ui/core/Paper";
import { observer, inject } from "mobx-react";
import PullRequestStore from "../../stores/PullRequestStore";
import RatingForm from "./RatingForm";
import ErrorNotice from "./ErrorNotice";
import { withStyles } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

const Dialog = withStyles({
  root: {
    maxWidth: "400px",
    marginRight: "1em",
    position: "relative"
  }
})(Paper);

const LoadingOverlay = (<div style={{
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: "white",
  opacity: 0.8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
}}><CircularProgress /></div>);

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
          {this.props.pullRequestStore!.requestInProgress ? LoadingOverlay : null}
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
