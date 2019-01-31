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
import bugsnagClient from "./util/bugsnagClient";

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
    .catch((e: Response | Error) => {
      console.log("view error", e);
      const resp = e as Response;
      const error = e as Error;
      if (resp.json) {
        resp.json().then((error: ApiError) => {
          messageCallback({
            type: "ViewResponse",
            rating: cachedValue.get(),
            error: error.error
          });
        });
      } else if (error.message) {
        if (error.message === "Attempting to use a disconnected port object") {
          // race condition where message is received after the port closed
          // (ie the github tab is closed)
        } else {
          throw error;
        }
      }
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

function handleError(error: Error | null, info: any) {
  const BugsnagReport = bugsnagClient.BugsnagReport;

  const handledState = {
    severity: "error",
    unhandled: true,
    severityReason: { type: "unhandledException" }
  };

  // scrub the stacktrace of reference to chrome so it gets reported
  let stacktrace = BugsnagReport.getStacktrace(error);
  stacktrace = stacktrace.map(function(frame) {
    frame.file = frame.file.replace(/chrome-extension:/g, "keepinghrome:");
    return frame;
  });

  // Tidy up the componentStack to look nice in bugsnag
  if (info && info.componentStack) {
    const lines: string[] = info.componentStack.split(/\s*\n\s*/g);
    let componentStack = "";
    for (let line of lines) {
      if (line.length) {
        componentStack += `${componentStack.length ? "\n" : ""}${line}`;
      }
    }
    info.componentStack = componentStack;
  }

  const report = new BugsnagReport(
    error.name,
    error.message,
    BugsnagReport.getStacktrace(error),
    handledState
  );
  report.updateMetaData("react", info);

  bugsnagClient.notify(report);
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
    if (msg.type === "UnhandledError") {
      handleError(msg.error, msg.info);
    } else {
      receiveUpdate(messageCallback, cachedValue, msg);
    }
  });
});

// Synchronous message handling for simple messages
// Right now, just the installation check.
chrome.runtime.onMessageExternal.addListener((message, sender, responder) => {
  console.log("message received from react-app", message, sender);
  if (message.type === "InstallationCheck") {
    responder({ installed: true });
  } else {
    console.log("unexpected message from hecate site", message, sender);
  }
});

// Async external messages for doing configuration from website
chrome.runtime.onConnectExternal.addListener(port => {
  port.onMessage.addListener((message, p) => {
    if (message.type === "SetConfiguration") {
      config.apiKey = message.apiKey;
      defaultApi
        .helo()
        .then(() => {
          console.log("all ok");
          p.postMessage({ configured: true });
        })
        .catch(e => {
          p.postMessage({ installationError: e });
        });
    } else {
      console.log("unexpected message from hecate site", message, p.sender);
    }
  });
});

// Post install setup
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: "https://app.hecate.co/heartbeat"
    });
  } else if (details.reason === "update") {
    // TODO add upgrade notes
  }
})
