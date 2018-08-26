import * as React from "react";
import { testToken } from "../util/api";

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

  private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newApiKey = this.apiKeyInput.value;
    testToken(newApiKey)
      .then(() => {
        chrome.storage.sync.set({ apiKey: newApiKey });
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
      <form onSubmit={this.handleSubmit.bind(this)}>
        <h3>Settings</h3>
        <div>
          <label>
            API Key
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
    );
  }
}
