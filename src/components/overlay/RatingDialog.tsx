import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@material-ui/core";
import BuildIcon from "@material-ui/icons/Build";
import PeopleIcon from "@material-ui/icons/People";
import Slider from "./Slider";

function Transition(props: any) {
  return <Slide direction="left" {...props} />;
}

interface IRatingDialogProps {
  open: boolean;
  close: () => void;
}

export default class RatingDialog extends React.Component<IRatingDialogProps> {
  public render() {
    return (
      <Dialog
        open={this.props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.props.close}
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
            <Grid container spacing={16}>
              <Grid item xs={6} sm={12}>
                <Typography variant="subtitle1" paragraph={false}>
                  Rate this PR
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider>
                  <BuildIcon fontSize="large" />
                </Slider>
              </Grid>
              <Grid item xs>
                <Slider>
                  <PeopleIcon fontSize="large" />
                </Slider>
              </Grid>
              <Grid item xs={6} sm={12}>
                <TextField
                  fullWidth
                  id="rating-labels"
                  label="Labels"
                  placeholder="eg. tech-debt high-value"
                  helperText="Private tags to categorise work"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6} sm={12}>
                <TextField
                  id="rating-notes"
                  label="Notes"
                  helperText="Any thoughts on the work or reasoning behind the rating"
                  multiline
                  fullWidth
                  rowsMax="4"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6} sm={12}>
                <Typography variant="subtitle1" paragraph={false}>
                  Remind me about this pull request when
                </Typography>
              </Grid>
              <Grid item xs>
                <FormControl fullWidth>
                  <InputLabel htmlFor="age-simple">Changes state</InputLabel>
                  <Select
                    fullWidth
                    inputProps={{
                      name: "reminder-state",
                      id: "reminder-state"
                    }}
                  >
                    <MenuItem value="None">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="merged">Merges</MenuItem>
                    <MenuItem value="closed">Closes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs>
                <TextField
                  id="reminder-date"
                  label="on date"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>

        <DialogActions>
          <Button color="primary" variant="outlined">
            Cancel
          </Button>
          <Button color="primary" variant="raised">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
