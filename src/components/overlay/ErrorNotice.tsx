import React from "react";
import PullRequestStore from "../../stores/PullRequestStore";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { inject, observer } from "mobx-react";

interface IErrorNoticeProps {
    pullRequestStore?: PullRequestStore;
}

const ErrorNotice: React.SFC<IErrorNoticeProps> = ({pullRequestStore}) => (
    <React.Fragment>
        <DialogTitle id="alert-dialog-slide-title">
          Hecate Heartbeat
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" color="error">
            There was an error.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={pullRequestStore!.toggleModal}
          >
            OK
          </Button>
        </DialogActions>
    </React.Fragment>
)

export default inject("pullRequestStore")(observer(ErrorNotice));