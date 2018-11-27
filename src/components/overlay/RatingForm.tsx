import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { inject, observer } from "mobx-react";
import PullRequestStore from "../../stores/PullRequestStore";
import RatingFormFields from "./RatingFormFields";

interface IRatingFormProps {
  pullRequestStore?: PullRequestStore;
}

class RatingForm extends React.Component<IRatingFormProps> {
  public render() {
    return (
      <React.Fragment>
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
          {this.props.pullRequestStore!.requestError && (
            <DialogContentText
              id="alert-dialog-slide-description"
              color="error"
            >
              There was an error of: {this.props.pullRequestStore.requestError}
            </DialogContentText>
          )}
          <div
            style={{ marginTop: "8px", padding: "8px 0", overflowX: "hidden" }}
          >
            <RatingFormFields />
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
          </div>
        </DialogContent>
      </React.Fragment>
    );
  }
}

export default inject("pullRequestStore")(observer(RatingForm));
