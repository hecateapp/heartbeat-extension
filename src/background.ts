import { UIRatingMessage, BackgroundRatingMessage } from "./util/types";
import { ObservableMap, observe } from "mobx";
import { setRating, logView } from "./util/api";

chrome.runtime.onInstalled.addListener(() => {
  const prs: ObservableMap<string, number> = new ObservableMap();

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
