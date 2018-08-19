import * as React from "react";
import * as ReactDOM from "react-dom";

import PullRequestOverlay from "./components/PullRequestOverlay";

const div = document.createElement('div');
div.style.position = 'fixed';
div.style.top = "0";
div.style.right = "0";

ReactDOM.render(
    <PullRequestOverlay prPath={location.pathname} />,
    div
);

document.body.appendChild(div);
console.log("heartbeat included on pr");

