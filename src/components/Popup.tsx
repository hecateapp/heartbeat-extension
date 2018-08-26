import * as React from "react";
import { SFC } from "react";

const openSettings = () => {
    chrome.runtime.openOptionsPage();
}

const Popup: SFC = () => (
  <div>
    <h1>Hecate Heartbeat</h1>
    <button onClick={openSettings}>Settings</button>
  </div>
);

export default Popup;
