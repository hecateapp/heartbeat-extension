import { decorate, observable, action } from "mobx";

class BackgroundStore {
    constructor() {
        chrome.storage.sync.get(['apiKey'], (items) => {
            this.apiKey = items.apiKey;
        })
    }

    public apiKey: string | undefined;

    public setApiKey(key: string) {
        this.apiKey = key;
        chrome.storage.sync.set({apiKey: key});
    }
}

decorate(BackgroundStore, {
    apiKey: observable,
    setApiKey: action,
});

export default BackgroundStore;