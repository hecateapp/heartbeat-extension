import * as React from "react";
import Button from "@material-ui/core/Button";
import { inject, observer } from "mobx-react";
import PullRequestStore from "../../stores/PullRequestStore";
import RatingFormFields from "./RatingFormFields";
import { Typography } from "@material-ui/core";

interface IRatingFormProps {
  pullRequestStore?: PullRequestStore;
}

class RatingForm extends React.Component<IRatingFormProps> {
  public render() {
    return (
      <div
        style={{
          margin: "16px 16px 8px"
        }}
      >
        <Typography variant="h5" gutterBottom>Hecate Heartbeat</Typography>
        <Typography variant="body2">
          Rate this pull request for both the quality of the outcome and the
          quality of the collaboration. Leave the slider in the centre for a
          neutral rating, push to the right for positive, and to the left for
          negative.
        </Typography>
        {this.props.pullRequestStore!.requestError && (
          <Typography variant="body2" color="error">
            There was an error of: {this.props.pullRequestStore.requestError}
          </Typography>
        )}
        <div
          style={{ marginTop: "8px", padding: "8px 0", overflowX: "hidden" }}
        >
          <RatingFormFields />
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px"
          }}>
            <Button
              style={{ marginLeft: "4px" }}
              color="primary"
              variant="outlined"
              onClick={this.props.pullRequestStore.cancelRating}
            >
              Cancel
            </Button>
            <Button
              style={{ marginLeft: "4px" }}
              color="primary"
              variant="contained"
              onClick={this.props.pullRequestStore.saveRating}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default inject("pullRequestStore")(observer(RatingForm));
