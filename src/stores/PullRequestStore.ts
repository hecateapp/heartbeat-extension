import { decorate, observable, action, runInAction } from "mobx";
import { UIRatingMessage, BackgroundRatingMessage } from "../util/types";

const prPathRegex = /^\/[\w-]+\/[\w-]+\/pull\/\d+/i;

class PullRequestStore {
  private port: chrome.runtime.Port;

  public prPath: string;
  public rating: number | undefined;

  public requestInProgress: boolean = false;
  public requestError: string | undefined;

  public navigateTo(path: string) {
    console.log("in navigate to with", path)
    if (this.prPath) {
      console.log("disconnecting last path")
      this.prPath = null;
      this.port.disconnect();
      this.port = null;
    }

    if (path.match(prPathRegex)) {
      console.log("definitely a PR");
      this.prPath = path;
      this.requestInProgress = true;
      this.connectPort();
    }
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
    this.rating = msg.rating;
    this.requestInProgress = false;
    if (msg.error) {
      this.requestError = "error saving rating";
    }
  }

  private connectPort() {
    runInAction(() => {
      this.port = chrome.runtime.connect({ name: this.prPath });
      this.port.onMessage.addListener(this.ratingCallback.bind(this));
    });

    this.port.onDisconnect.addListener(() => {
      runInAction(() => {
        this.port = null;
        this.connectPort();
      });
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
  prPath: observable,
  rating: observable,
  requestInProgress: observable,
  requestError: observable,

  navigateTo: action,
  setRating: action,
  ratingCallback: action
});

export default PullRequestStore;
