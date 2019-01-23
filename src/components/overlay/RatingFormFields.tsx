import * as React from "react";
import { Component, Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import BuildIcon from "@material-ui/icons/Build";
import PeopleIcon from "@material-ui/icons/People";
import Slider from "./Slider";
import { inject, observer } from "mobx-react";
import PullRequestStore from "../../stores/PullRequestStore";
import { Rating } from "../../generated/api";

interface IRatingFormProps {
  pullRequestStore?: PullRequestStore;
}

class RatingFormFields extends Component<IRatingFormProps> {
  private changeHandler<K extends keyof Rating>(
    key: K
  ): (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void {
    return event => {
      this.props.pullRequestStore!.setRatingProperty<K>(
        key,
        event.target.value
      );
    };
  }

  private changeSlider(
    key: "outcomeScore" | "processScore"
  ): (event: React.ChangeEvent, value: string) => void {
    return (event, value) => {
      this.props.pullRequestStore.setRatingProperty<
        "outcomeScore" | "processScore"
      >(key, value);
    };
  }

  public render() {
    if (!this.props.pullRequestStore || !this.props.pullRequestStore.rating) {
      return null;
    }

    return (
      <Fragment>
        <Grid container spacing={16}>
          <Grid item xs={6} sm={12}>
            <Typography variant="subtitle1" paragraph={false}>
              Rate this PR
            </Typography>
          </Grid>
          <Grid item xs>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BuildIcon />
              <Typography
                variant="subtitle1"
                component="span"
                style={{ marginLeft: "1.2em" }}
              >
                Outcome
              </Typography>
            </div>
            <Slider
              value={this.props.pullRequestStore.rating.outcomeScore}
              onChange={this.changeSlider("outcomeScore")}
              key={this.props.pullRequestStore.rating.outcomeScore}
            />
          </Grid>
          <Grid item xs>
            <div style={{ display: "flex", alignItems: "center" }}>
              <PeopleIcon />
              <Typography
                variant="subtitle1"
                component="span"
                style={{ marginLeft: "1.2em" }}
              >
                Collaboration
              </Typography>
            </div>
            <Slider
              value={this.props.pullRequestStore.rating.processScore}
              onChange={this.changeSlider("processScore")}
              key={this.props.pullRequestStore.rating.processScore}
            />
          </Grid>
          {/* <Grid item xs={6} sm={12}>
            <TextField
              fullWidth
              id="rating-labels"
              label="Labels"
              placeholder="eg. tech-debt high-value"
              helperText="Private tags to categorise work"
              margin="normal"
            />
          </Grid> */}
          <Grid item xs={6} sm={12}>
            <TextField
              id="rating-notes"
              label="Notes"
              helperText="Any thoughts on the work or reasoning behind the rating"
              multiline
              fullWidth
              rowsMax="4"
              margin="normal"
              value={this.props.pullRequestStore.rating.notes || ""}
              onChange={this.changeHandler<"notes">("notes")}
            />
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default inject("pullRequestStore")(observer(RatingFormFields));
