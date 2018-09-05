import { UIRatingMessage, BackgroundRatingMessage } from "./util/types";
import { ObservableMap } from "mobx";
import { setRating, logView } from "./util/api";

const prs: ObservableMap<string, number> = new ObservableMap();
const ports: chrome.runtime.Port[] = []; 

let apiKey: string;
chrome.storage.sync.get("apiKey", items => {
  apiKey = items.apiKey;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync") {
    if (changes.apiKey) {
      apiKey = changes.apiKey.newValue;
    }
  }
});

chrome.runtime.onConnect.addListener(port => {
  console.log("New port connected", port.name);
  ports.push(port);
  const prPath = port.name;
  if (!prs.has(prPath)) {
    prs.set(prPath, null);
  }

  const cancel = prs.observe(change => {
    if (change.type === "update" && change.name === prPath) {
      const msg: BackgroundRatingMessage = { rating: change.newValue };
      port.postMessage(msg);
    }
  });
  port.onDisconnect.addListener(() => {
    const i = ports.indexOf(port);
    if (i > -1) {
      ports.splice(i, 1);
    }
    cancel();
  });

  port.onMessage.addListener((msg: UIRatingMessage) => {
    setRating(apiKey, msg.prPath, msg.rating)
      .then(resp => {
        prs.set(msg.prPath, resp.rating);
      })
      .catch(reason => {
        const msg: BackgroundRatingMessage = {
          rating: prs.get(prPath),
          error: reason
        };
        port.postMessage(msg);
      });
  });

  logView(apiKey, prPath)
    .then(resp => {
      if (prs.get(prPath) === resp.rating) {
        const msg: BackgroundRatingMessage = {
          rating: resp.rating,
        };
        port.postMessage(msg);
      } else {
        prs.set(prPath, resp.rating);
      }
    })
    .catch(reason => {
      const msg: BackgroundRatingMessage = {
        rating: prs.get(prPath),
        error: reason
      };
      port.postMessage(msg);
    });
});