export interface Movie {
  id: number;
  movieId: number;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  titleTranslation?: string;
  year?: number;
  genres: string[];
  posterUrl?: string;
  averageRating?: number;
  ratingCount: number;
  popularity?: number;
  runtime?: number;
  synopsis?: string;
}
