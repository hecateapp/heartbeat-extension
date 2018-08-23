import { decorate, observable, action, runInAction } from "mobx";
import { UIRatingMessage, BackgroundRatingMessage } from "../util/types";

class PullRequestStore {
  private port: chrome.runtime.Port;

  public prPath: string;
  public rating: number | undefined;

  public requestInProgress: boolean = false;
  public requestError: string | undefined;

  public loadRating(prPath: string) {
    this.prPath = prPath;
    this.requestInProgress = true;
    this.connectPort();
  }

  public setRating(rating: number) {
    this.rating = rating;
    this.requestError = undefined;
    this.requestInProgress = true;

    this.postMessage({
      prPath: this.prPath,
      rating: this.rating
    });
  }

  public ratingCallback(msg: BackgroundRatingMessage) {
    console.log("received message", msg);
    this.rating = msg.rating;
    this.requestInProgress = false;
    if (msg.error) {
      console.log("error sending rating", msg.error);
      this.requestError = "error saving rating";
    }
  }

  private connectPort() {
    runInAction(() => {
      this.port = chrome.runtime.connect({ name: this.prPath });
      this.port.onMessage.addListener(this.ratingCallback.bind(this));
    })
    
    this.port.onDisconnect.addListener(() => {
      runInAction(() => {
        this.port = null;
        this.connectPort();
      })
    });
  }

  private postMessage(msg: UIRatingMessage) {
    if (!this.port) {
      this.connectPort();
    }
    this.port.postMessage(msg);
  }
}

decorate(PullRequestStore, {
  rating: observable,
  requestInProgress: observable,
  requestError: observable,

  loadRating: action,
  setRating: action,
  ratingCallback: action
});

export default PullRequestStore;
