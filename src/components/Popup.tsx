import React from "react";
import { SFC } from "react";
import BugsnagReporter from "./BugsnagReporter";

const openSettings = () => {
  chrome.runtime.openOptionsPage();
};

const Popup: SFC = () => (
  <BugsnagReporter>
    <div>
      <h1>Hecate Heartbeat</h1>
      <button onClick={openSettings}>Settings</button>
    </div>
  </BugsnagReporter>
);

export default Popup;
