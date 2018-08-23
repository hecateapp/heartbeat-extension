export interface UIRatingMessage {
    prPath: string;
    rating: number;
}

export interface BackgroundRatingMessage {
    rating: number;
    error?: any;
}