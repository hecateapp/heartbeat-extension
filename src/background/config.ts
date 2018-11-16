class Config {
  public apiKey: string | null;

  constructor() {
    chrome.storage.sync.get("apiKey", items => {
      this.apiKey = items.apiKey;
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "sync") {
        if (changes.apiKey) {
          this.apiKey = changes.apiKey.newValue;
        }
      }
    });
  }
}

export default Config