import { DefaultApi, Configuration, Rating, ApiError } from "./generated/api";
import Config from "./background/config";
import Cache, { CacheValue } from "./background/Cache";
import {
  ViewResponse,
  ObservedRatingUpdateResponse,
  SaveRatingResponse,
  BackgroundMessage,
  SaveRatingRequest
} from "./models/messageTypes";

const config = new Config();

const apiConfig = new Configuration({
  apiKey: () => `Token token="${config.apiKey}"`,
  basePath: config.apiBasePath
});
const defaultApi = new DefaultApi(apiConfig);

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

  defaultApi
    .view({ prPath })
    .then(resp => {
      cachedValue.set(resp.rating);

      messageCallback({
        type: "ViewResponse",
        rating: resp.rating
      });
    })
    .catch((resp: Response) => {
      console.log("view error", resp);
      resp.json().then((error: ApiError) => {
        messageCallback({
          type: "ViewResponse",
          rating: cachedValue.get(),
          error: error.error
        });
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
  defaultApi
    .setRating({ prPath: msg.prPath, ...msg.rating })
    .then(resp => {
      cachedValue.set(resp);
    })
    .catch((resp: Response) => {
      console.log("setRating error", resp);
      resp.json().then((error: ApiError) => {
        messageCallback({
          type: "SaveRatingResponse",
          error: error.error
        });
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
