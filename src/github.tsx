import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { configure as configureMobx } from "mobx";

import PullRequestStore from "./stores/PullRequestStore";

import PullRequestOverlay from "./components/PullRequestOverlay";
import BugsnagReporter from "./components/BugsnagReporter";

const pullRequestStore = new PullRequestStore();

configureMobx({
  enforceActions: true
});

const stores = {
  pullRequestStore
};

const navigateTo = () => {
  const path = location.pathname;
  console.log("pjax:end", path);
  pullRequestStore.navigateTo(path);
};

document.addEventListener("pjax:end", navigateTo);
navigateTo();

const div = document.createElement("div");
div.style.position = "fixed";
div.style.bottom = "0";
div.style.right = "0";
div.style.zIndex = "90210";

ReactDOM.render(
  <BugsnagReporter>
    <Provider {...stores}>
      <PullRequestOverlay />
    </Provider>
  </BugsnagReporter>,
  div
);

document.body.appendChild(div);
