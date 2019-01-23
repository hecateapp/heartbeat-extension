class Config {
  private _apiKey: string | null;

  public get apiKey(): string | null {
    return this._apiKey;
  }

  public set apiKey(newValue: string) {
    this._apiKey = newValue;
    chrome.storage.sync.set({ apiKey: newValue });
  }

  public get apiBasePath(): string {
    return process.env.NODE_ENV !== "production"
      ? "http://localhost:4567"
      : "https://api.hecate.co";
  }

  constructor() {
    chrome.storage.sync.get("apiKey", items => {
      this._apiKey = items.apiKey;
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "sync") {
        if (changes.apiKey) {
          this._apiKey = changes.apiKey.newValue;
        }
      }
    });
  }
}

export default Config;
