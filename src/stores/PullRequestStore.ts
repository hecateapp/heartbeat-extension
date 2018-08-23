import { decorate, observable, action, runInAction } from "mobx";
import { UIRatingMessage, BackgroundRatingMessage } from "../util/types";
import { logView } from "../util/api";

class PullRequestStore {
    private port: chrome.runtime.Port;
    
    public prPath: string;
    public rating: number | undefined;
    
    public requestInProgress: boolean = false;
    public requestError: string | undefined;

    public loadRating(prPath: string) {
        this.prPath = prPath;
        this.requestInProgress = true;
        this.port = chrome.runtime.connect({name: this.prPath});
        this.port.onMessage.addListener(this.ratingCallback.bind(this));
    }

    public setRating(rating: number) {
        this.rating = rating;
        this.requestError = undefined;
        this.requestInProgress = true;
        
        const msg: UIRatingMessage = {
            prPath: this.prPath,
            rating: this.rating,
        };
        this.port.postMessage(msg);
    }

    public ratingCallback(msg: BackgroundRatingMessage) {
        console.log("received message", msg);
        this.rating = msg.rating;
        this.requestInProgress = false;
    }
}

decorate(PullRequestStore, {
    rating: observable,
    requestInProgress: observable,
    requestError: observable,
    
    loadRating: action,
    setRating: action,
    ratingCallback: action,
});

export default PullRequestStore;