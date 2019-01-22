import { decorate, observable, action, runInAction } from "mobx";
import { BackgroundMessage, SaveRatingRequest } from "../models/messageTypes";
import Rating from "../models/Rating";
const prPathRegex = /^\/[\w-]+\/[\w-]+\/pull\/\d+/i;

class PullRequestStore {
  private port: chrome.runtime.Port;

  public prPath: string;

  public isModalOpen: boolean = false;

  public rating?: Rating;
  public serverRating?: Rating;

  public requestInProgress: boolean = false;
  public requestError: string | undefined;

  public authError: boolean = false;

  public navigateTo(path: string) {
    if (this.prPath) {
      this.prPath = null;
      this.port.disconnect();
      this.port = null;
    }

    if (path.match(prPathRegex)) {
      this.prPath = path;
      this.requestInProgress = true;
      this.connectPort();
    }
  }

  public toggleModal = () => {
    if (this.isModalOpen) {
      this.isModalOpen = false;
    } else {
      if (!this.rating) {
        this.resetRating()
      }
      this.isModalOpen = true;
    }
  }

  public cancelRating = () => {
    this.isModalOpen = false;
    this.resetRating();
  }

  public resetRating = () => {
      if (this.serverRating) {
        this.rating = this.serverRating;
      } else {
        this.rating = new Rating();
      }
  };

  public saveRating = () => {
    if (this.rating) {
      this.requestError = undefined;
      this.requestInProgress = true;

      this.postMessage({
        type: "SaveRatingRequest",
        prPath: this.prPath,
        rating: this.rating
      });
    }
  };

  public setRatingProperty<K extends keyof Rating>(key: K, value: Rating[K]) {
    this.rating[key] = value;
  }

  public backgroundMessageCallback(msg: BackgroundMessage) {
    console.log("Backend message received", msg);
    switch (msg.type) {
      case "AuthError":
        // handle no auth:
        this.authError = true;
        break;
      case "SaveRatingResponse":
        if (msg.error) {
          this.requestError = msg.error;
        }
        break;
      case "ObservedRatingUpdateResponse":
        this.serverRating = msg.rating;
        if (this.requestInProgress && this.isModalOpen) {
          this.isModalOpen = false;
        }
        break;
      case "ViewResponse":
        if (msg.error) {
          this.requestError = msg.error;
        } else if (msg.rating) {
          this.serverRating = msg.rating;
          if (this.requestInProgress) {
            this.rating = this.serverRating;
          }
        }
        break;
    }
    this.requestInProgress = false;
    console.log("requestInProgress", this.requestInProgress);
  }

  private connectPort() {
    runInAction(() => {
      this.port = chrome.runtime.connect({ name: this.prPath });
      this.port.onMessage.addListener(
        this.backgroundMessageCallback.bind(this)
      );
    });

    this.port.onDisconnect.addListener(() => {
      runInAction(() => {
        this.port = null;
        this.connectPort();
      });
    });
  }

  private postMessage(msg: SaveRatingRequest) {
    if (!this.port) {
      this.connectPort();
    }
    this.port.postMessage(msg);
  }
}

decorate(PullRequestStore, {
  prPath: observable,
  rating: observable,
  serverRating: observable,
  requestInProgress: observable,
  requestError: observable,
  authError: observable,
  isModalOpen: observable,

  navigateTo: action,
  saveRating: action,
  backgroundMessageCallback: action,
  toggleModal: action,
  cancelRating: action,
  setRatingProperty: action
});

export default PullRequestStore;
