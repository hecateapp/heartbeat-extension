import bugsnagClient from "../util/bugsnagClient";
import React from "react";
import createPlugin from "bugsnag-react";

const ErrorBoundary = bugsnagClient.use(createPlugin(React));

const BugsnagReporter: React.SFC = ({ children }) => (
  <ErrorBoundary>{children}</ErrorBoundary>
);

export default BugsnagReporter;
