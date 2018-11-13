import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide
} from "@material-ui/core";

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
          Hecate Heartbeat Rating
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            TODO: Put the rating form and stuff in here
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="outlined">Cancel</Button>
          <Button color="primary" variant="raised">Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
