import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { configure as configureMobx } from "mobx";

import PullRequestStore from "./stores/PullRequestStore";

import PullRequestOverlay from "./components/PullRequestOverlay";

const pullRequestStore = new PullRequestStore();

configureMobx({
  enforceActions: true
});

const stores = {
  pullRequestStore
};

const div = document.createElement("div");
div.style.position = "fixed";
div.style.bottom = "0";
div.style.right = "0";
div.style.zIndex = "90210";

const prPath = location.pathname;

ReactDOM.render(
  <Provider {...stores}>
    <PullRequestOverlay prPath={prPath} />
  </Provider>,
  div
);

document.body.appendChild(div);
console.log("heartbeat included on pr");
