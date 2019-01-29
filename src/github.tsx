import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider as MobxProvider } from "mobx-react";
import { configure as configureMobx } from "mobx";

import { create } from "jss";
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";

const styleNode = document.createComment("jss-insertion-point");
document.head.insertBefore(styleNode, document.head.firstChild);

import PullRequestStore from "./stores/PullRequestStore";

import PullRequestOverlay from "./components/PullRequestOverlay";

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
    useNextVariants: true
  }
});

const div = document.createElement("div");
div.style.position = "fixed";
div.style.bottom = "0";
div.style.right = "0";
div.style.zIndex = "90210";

ReactDOM.render(
  <MobxProvider {...stores}>
    <MuiThemeProvider theme={theme}>
      <PullRequestOverlay />
    </MuiThemeProvider>
  </MobxProvider>,
  div
);

document.body.appendChild(div);
