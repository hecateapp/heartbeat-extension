declare module "bugsnag-react" {
    import { IPlugin } from "bugsnag-js/types/client";
    import * as React from "react";

    const createPlugin: (react: typeof React) => IPlugin
    export default createPlugin;
    export const formatComponentStack: (str: string) => string;
}