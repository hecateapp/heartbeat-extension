import bugsnagClient from "../util/bugsnagClient";
import React from "react";
import bugsnagReact from "@bugsnag/plugin-react";

bugsnagClient.use(bugsnagReact, React);

const ErrorBoundary = bugsnagClient.getPlugin("react");


const BugsnagReporter: React.SFC = ({ children }) => (
  <ErrorBoundary>{children}</ErrorBoundary>
);

export default BugsnagReporter;
