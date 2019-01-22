``;
import { setRating, logView } from "./util/api";
import Config from "./background/config";
import Cache, { CacheValue } from "./background/Cache";
import {
  ViewResponse,
  ObservedRatingUpdateResponse,
  SaveRatingResponse,
  BackgroundMessage,
  SaveRatingRequest
} from "./models/messageTypes";
import Rating from "./models/Rating";

const config = new Config();

function onLoad(
  messageCallback: (msg: ViewResponse) => void,
  cachedValue: CacheValue<Rating>,
  prPath: string
) {
  const rating = cachedValue.get();

  if (rating) {
    messageCallback({
      type: "ViewResponse",
      rating: rating
    });
  }

  logView(config.apiKey, prPath)
    .then(resp => {
      cachedValue.set(resp.rating);

      messageCallback({
        type: "ViewResponse",
        rating: resp.rating
      });
    })
    .catch((reason: Error) => {
      messageCallback({
        type: "ViewResponse",
        rating: cachedValue.get(),
        error: reason.message
      });
    });
}

function notifyUpdate(
  messageCallback: (msg: ObservedRatingUpdateResponse) => void,
  rating: Rating
) {
  messageCallback({ type: "ObservedRatingUpdateResponse", rating: rating });
}

function receiveUpdate(
  messageCallback: (msg: SaveRatingResponse) => void,
  cachedValue: CacheValue<Rating>,
  msg: SaveRatingRequest
) {
  setRating(config.apiKey, msg.prPath, msg.rating)
    .then(resp => {
      cachedValue.set(resp.rating);
    })
    .catch((reason: Error) => {
      messageCallback({
        type: "SaveRatingResponse",
        error: reason.message
      });
    });
}

const cache = new Cache<Rating>();

chrome.runtime.onConnect.addListener(port => {
  console.log("New port connected", port.name);
  const key = port.name;

  const messageCallback = (msg: BackgroundMessage) => {
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
