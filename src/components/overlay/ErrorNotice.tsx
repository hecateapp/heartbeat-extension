import * as React from "react";
import PullRequestStore from "../../stores/PullRequestStore";
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
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
            onClick={pullRequestStore!.closeModal}
          >
            OK
          </Button>
        </DialogActions>
    </React.Fragment>
)

export default inject("pullRequestStore")(observer(ErrorNotice));