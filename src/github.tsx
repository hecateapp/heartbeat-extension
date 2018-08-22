import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { configure as configureMobx } from "mobx";

import PullRequestStore from "./stores/PullRequestStore";

import PullRequestOverlay from "./components/PullRequestOverlay";

const prPath = location.pathname;

const pullRequestStore = new PullRequestStore(prPath);

configureMobx({
  enforceActions: true
});

const stores = {
  pullRequestStore
};

const div = document.createElement("div");
div.style.position = "fixed";
div.style.top = "0";
div.style.right = "0";

ReactDOM.render(
  <Provider {...stores}>
    <PullRequestOverlay />
  </Provider>,
  div
);

document.body.appendChild(div);
console.log("heartbeat included on pr");
