import * as React from "react";
import {
  Dialog,
  Slide,
} from "@material-ui/core";
import { observer, inject } from "mobx-react";
import PullRequestStore from "../../stores/PullRequestStore";
import RatingForm from "./RatingForm";
import ErrorNotice from "./ErrorNotice";

function Transition(props: any) {
  return <Slide direction="left" {...props} />;
}

interface IRatingDialogProps {
  pullRequestStore?: PullRequestStore;
}

class RatingDialog extends React.Component<IRatingDialogProps> {
  public render() {
    if (!this.props.pullRequestStore) {
      return null;
    }

    return (
      <Dialog
        open={this.props.pullRequestStore.isModalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.props.pullRequestStore.closeModal}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        {this.props.pullRequestStore!.authError ? <ErrorNotice /> : <RatingForm />}
      </Dialog>
    );
  }
}

export default inject("pullRequestStore")(observer(RatingDialog));
