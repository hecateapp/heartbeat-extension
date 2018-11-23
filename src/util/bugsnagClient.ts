// initialize bugsnag ASAP, before other imports
import bugsnag from "bugsnag-js";
import { IConfig } from "bugsnag-js/types/common";
import Report from "bugsnag-js/types/report";

// Hack from https://docs.bugsnag.com/platforms/browsers/faq/#how-can-i-get-error-reports-from-browser-extensions
function beforeSend(report: Report) {
  report.stacktrace = report.stacktrace.map(function(frame) {
    frame.file = frame.file.replace(/chrome-extension:/g, "chrome_extension:");
    return frame;
  });
}

const bugsnagConfig: IConfig = {
  apiKey: "1a6939ea4140dba5f4e84d13e65a4943",
  beforeSend: beforeSend,
  autoCaptureSessions: false,
};

export default bugsnag(bugsnagConfig);
