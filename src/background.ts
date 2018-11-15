import { UIRatingMessage, BackgroundRatingMessage } from "./util/types";
import { ObservableMap } from "mobx";
import { setRating, logView } from "./util/api";
import Config from "./util/config";

const config = new Config();

function onLoad(
  messageCallback: (msg: BackgroundRatingMessage) => void,
  updateCache: (val: number) => void,
  readCache: () => number,
  prPath: string
) {
  const rating = readCache();

  if (rating) {
    messageCallback({
      rating: rating
    });
  }

  if (!config.apiKey) {
    messageCallback({
      rating: readCache(),
      error: "No API key set"
    });
    return;
  }

  logView(config.apiKey, prPath)
    .then(resp => {
      updateCache(resp.rating);
    })
    .catch(reason => {
      messageCallback({
        rating: readCache(),
        error: reason
      });
    });
}

function notifyUpdate(
  messageCallback: (msg: BackgroundRatingMessage) => void,
  rating: number
) {
  messageCallback({ rating: rating });
}

function receiveUpdate(
  messageCallback: (msg: BackgroundRatingMessage) => void,
  writeCache: (val: number) => void,
  msg: any
) {
  setRating(config.apiKey, msg.prPath, msg.rating)
    .then(resp => {
      writeCache(resp.rating);
    })
    .catch(reason => {
      messageCallback({
        rating: null,
        error: reason
      });
    });
}

const cache: ObservableMap<string, number> = new ObservableMap();

chrome.runtime.onConnect.addListener(port => {
  console.log("New port connected", port.name);
  const key = port.name;

  const messageCallback = (msg: BackgroundRatingMessage) => {
    port.postMessage(msg);
  };

  const updateCache = (val: number) => {
    cache.set(key, val);
  };

  const readCache = (): number => {
    return cache.get(key);
  };

  onLoad(messageCallback, updateCache, readCache, key);

  const cancel = cache.observe(change => {
    if (change.type === "update" && change.name === key) {
      notifyUpdate(messageCallback, change.newValue);
    }
  });
  port.onDisconnect.addListener(() => {
    cancel();
  });

  port.onMessage.addListener((msg: any) => {
    receiveUpdate(messageCallback, updateCache, msg);
  });
});
