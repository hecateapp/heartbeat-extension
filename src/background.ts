import { UIRatingMessage, BackgroundRatingMessage } from "./util/types";
import { ObservableMap, observe } from "mobx";
import { logView } from "./util/api";

chrome.runtime.onInstalled.addListener(() => {
  const prs: ObservableMap<string, number> = new ObservableMap();

  chrome.runtime.onConnect.addListener(port => {
    const prPath = port.name;
    if (!prs.has(prPath)) {
      prs.set(prPath, null);
    }

    const cancel = prs.observe(change => {
      console.log("change", change);
      if (change.type === "update" && change.name === prPath) {
        const msg: BackgroundRatingMessage = { rating: change.newValue };
        port.postMessage(msg);
      }
    });
    port.onDisconnect.addListener(() => {
      cancel();
    });

    port.onMessage.addListener((msg: UIRatingMessage) => {
      console.log("got msg", msg);
      prs.set(msg.prPath, msg.rating);
    });

    logView(prPath)
      .then(resp => {
        prs.set(prPath, resp.rating);
      })
      .catch(reason => {
        const msg: BackgroundRatingMessage = {
          rating: prs.get(prPath),
          error: reason
        };
        port.postMessage(msg);
      });
  });
});
