import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { configure } from "mobx";

import BackgroundStore from "./stores/BackgroundStore";

import AuthTokenForm from "./components/AuthTokenForm";

const backgroundStore = new BackgroundStore();

const stores = {
  backgroundStore
};

configure({ enforceActions: true });

ReactDOM.render(
  <Provider {...stores}>
    <AuthTokenForm />
  </Provider>,
  document.getElementById("root")
);
