import * as React from "react";

interface IPullRequestOverlayProps {
  prPath: string;
}

class PullRequestOverlay extends React.Component<IPullRequestOverlayProps> {
    componentDidMount() {
        fetch("http://localhost:4567/heartbeat/view", {
            method: "POST",
            body: JSON.stringify({
                pr_path: this.props.prPath,
            })
        }).then(resp => {
            if(!resp.ok) {
                throw new Error(resp.status.toString());
            }
            return resp.json()
        }).then(resp => {
            console.log(resp);
        })
    }

    render() {
        return <h1 style={{ color: "red" }}>{this.props.prPath}</h1>;
    }
}

export default PullRequestOverlay;
