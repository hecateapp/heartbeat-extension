import { UIRatingMessage, BackgroundRatingMessage } from "./util/types";

import { setRating, logView } from "./util/api";
import Config from "./background/config";
import Cache, { CacheValue } from "./background/Cache";

const config = new Config();

function onLoad(
  messageCallback: (msg: BackgroundRatingMessage) => void,
  cachedValue:  CacheValue<number>,
  prPath: string
) {
  const rating = cachedValue.get();

  if (rating) {
    messageCallback({
      rating: rating
    });
  }

  logView(config.apiKey, prPath)
    .then(resp => {
      cachedValue.set(resp.rating);
    })
    .catch(reason => {
      messageCallback({
        rating: cachedValue.get(),
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
  cachedValue: CacheValue<number>,
  msg: any
) {
  setRating(config.apiKey, msg.prPath, msg.rating)
    .then(resp => {
      cachedValue.set(resp.rating);
    })
    .catch(reason => {
      messageCallback({
        rating: null,
        error: reason
      });
    });
}

const cache = new Cache<number>();

chrome.runtime.onConnect.addListener(port => {
  console.log("New port connected", port.name);
  const key = port.name;

  const messageCallback = (msg: BackgroundRatingMessage) => {
    port.postMessage(msg);
  };

  const cachedValue = cache.value(key);

  if (!config.apiKey) {
    port.postMessage({
      error: "No API key set"
    });
  }

  onLoad(messageCallback, cachedValue, key);

  const cancel = cache.observe(key, newValue => {
    notifyUpdate(messageCallback, newValue);
  });

  port.onDisconnect.addListener(() => {
    cancel();
  });

  port.onMessage.addListener((msg: any) => {
    receiveUpdate(messageCallback, cachedValue, msg);
  });
});
