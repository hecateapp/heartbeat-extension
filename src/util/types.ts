import { decorate, action, observable } from "mobx";

export interface SaveRatingRequest {
  type: "SaveRatingRequest";
  prPath: string;
  rating: Rating;
}

export type BackgroundMessage =
  | SaveRatingResponse
  | ViewResponse
  | ObservedRatingUpdateResponse
  | AuthError;

export interface SaveRatingResponse {
  type: "SaveRatingResponse";
  error?: string;
}

export interface ViewResponse {
  type: "ViewResponse";
  rating?: Rating;
  error?: string;
}

export interface ObservedRatingUpdateResponse {
  type: "ObservedRatingUpdateResponse";
  rating: Rating;
}

export interface AuthError {
  type: "AuthError";
}

class Rating {
  public outcomeScore: number = 0;
  public processScore: number = 0;
  public labels: string[] = [];
  public notes?: string;
  public remindOnDate?: string; // TODO make date?
  public remindOnState?: string;
}

decorate(Rating, {
  outcomeScore: observable,
  processScore: observable,
  labels: observable,
  notes: observable,
  remindOnDate: observable,
  remindOnState: observable
});
export { Rating };
