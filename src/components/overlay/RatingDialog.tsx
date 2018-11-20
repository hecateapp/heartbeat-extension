import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
} from "@material-ui/core";
import { observer, inject } from "mobx-react";
import PullRequestStore from "../../stores/PullRequestStore";
import RatingForm from "./RatingForm";

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
        <DialogTitle id="alert-dialog-slide-title">
          Hecate Heartbeat
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Rate this pull request for both the quality of the outcome and the
            quality of the collaboration. Leave the slider in the centre for a
            neutral rating, push to the right for positive, and to the left for
            negative.
          </DialogContentText>
          <div
            style={{ marginTop: "8px", padding: "8px 0", overflowX: "hidden" }}
          >
            <RatingForm />
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={this.props.pullRequestStore.closeModal}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={this.props.pullRequestStore.saveRating}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default inject("pullRequestStore")(observer(RatingDialog));
