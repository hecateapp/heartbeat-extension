import Rating from "./Rating";

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
