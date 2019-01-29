import React from "react";
import BugsnagReporter from "./BugsnagReporter";
import { DefaultApi, Configuration } from "../generated/api";
import Config from "../background/config";

interface ISettingsState {
  apiTokenStatus: string | undefined;
  apiKey: string | undefined;
}

export default class Settings extends React.Component<{}, ISettingsState> {
  private apiKeyInput: HTMLInputElement;

  constructor(props: any) {
    super(props);
    this.state = {
      apiTokenStatus: undefined,
      apiKey: undefined
    };
  }

  private testToken(newApiKey: string) {
    // TODO extract this somewhere shared
    const config = new Config();
    config.apiKey = newApiKey;

    const apiConfig = new Configuration({
      apiKey: () => `Token token="${config.apiKey}"`,
      basePath: config.apiBasePath
    });
    const defaultApi = new DefaultApi(apiConfig);

    return defaultApi.helo();
  }

  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newApiKey = this.apiKeyInput.value;
    this.testToken(newApiKey)
      .then(() => {
        this.setState({ apiTokenStatus: "Success!" });
      })
      .catch(() => {
        this.setState({ apiTokenStatus: "Error." });
      });
  }

  public componentDidMount() {
    chrome.storage.sync.get("apiKey", items => {
      this.setState({ apiKey: items.apiKey });
    });
  }

  public render() {
    return (
      <BugsnagReporter>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <h3>Settings</h3>
          <div>
            <label>
              API Key{" "}
              <input
                name="apiKey"
                type="text"
                defaultValue={this.state.apiKey}
                ref={input => (this.apiKeyInput = input)}
              />
            </label>
            <input type="submit" value="Save" />
            {this.state.apiTokenStatus ? (
              <p>{this.state.apiTokenStatus}</p>
            ) : null}
          </div>
        </form>
      </BugsnagReporter>
    );
  }
}
