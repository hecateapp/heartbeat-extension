import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider as MobxProvider } from "mobx-react";
import { configure as configureMobx } from "mobx";

import JssProvider from "react-jss/lib/JssProvider";
import { create } from "jss";
import { createGenerateClassName, jssPreset, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const styleNode = document.createComment("jss-insertion-point");
document.head.insertBefore(styleNode, document.head.firstChild);

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: "jss-insertion-point"
});

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

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const div = document.createElement("div");
div.style.position = "fixed";
div.style.bottom = "0";
div.style.right = "0";
div.style.zIndex = "90210";

ReactDOM.render(
  <BugsnagReporter>
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MobxProvider {...stores}>
        <MuiThemeProvider theme={theme}>
          <PullRequestOverlay />
        </MuiThemeProvider>
      </MobxProvider>
    </JssProvider>
  </BugsnagReporter>,
  div
);

document.body.appendChild(div);
