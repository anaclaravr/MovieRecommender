import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

import { Movie } from '../models/movie';
import { API_BASE_URL } from './api.config';
import {
  ApiFavoriteMoviesPayload,
  ApiFavoriteRead,
  ApiMovie,
  ApiRecommendationRead,
  ApiRecommendationTestDriveRead,
} from './api-types';
import { mapApiMovie } from './movie-api.service';

export interface MovieRecommendation {
  movie: Movie;
  id?: number;
  userId: number;
  filmeId: number;
  similarityScore: number;
  rankPosition: number;
  recommendedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class RecommendationApiService {
  private readonly http = inject(HttpClient);

  saveFavoriteMovies(userId: number, movieIds: number[]): Observable<ApiFavoriteRead[]> {
    const payload: ApiFavoriteMoviesPayload = { filmes_ids: movieIds };

    return this.http.post<ApiFavoriteRead[]>(`${API_BASE_URL}/users/${userId}/favoritos/`, payload);
  }

  testDriveFavoriteMovies(userId: number, movieIds: number[]): Observable<MovieRecommendation[]> {
    const payload: ApiFavoriteMoviesPayload = { filmes_ids: movieIds };

    return this.http
      .post<ApiRecommendationTestDriveRead[]>(
        `${API_BASE_URL}/users/${userId}/favoritos/test_drive/`,
        payload,
      )
      .pipe(map((items) => items.map((item) => mapRecommendation(item, item.filme))));
  }

  listRecommendations(userId: number): Observable<ApiRecommendationRead[]> {
    return this.http.get<ApiRecommendationRead[]>(`${API_BASE_URL}/users/${userId}/recomendacoes/`);
  }

  listRecommendedMovies(userId: number): Observable<Movie[]> {
    return this.http
      .get<ApiMovie[]>(`${API_BASE_URL}/users/${userId}/recomendacoes/filmes/`)
      .pipe(map((movies) => movies.map(mapApiMovie)));
  }

  listJoinedRecommendations(userId: number): Observable<MovieRecommendation[]> {
    return forkJoin({
      recommendations: this.listRecommendations(userId),
      movies: this.listRecommendedMovies(userId),
    }).pipe(
      map(({ recommendations, movies }) => {
        const movieById = new Map(movies.map((movie) => [movie.id, movie]));

        return recommendations
          .map((recommendation) => {
            const movie = movieById.get(recommendation.filme_id);

            return movie ? mapRecommendation(recommendation, movie) : null;
          })
          .filter((item): item is MovieRecommendation => item !== null)
          .sort((left, right) => left.rankPosition - right.rankPosition);
      }),
    );
  }
}

function mapRecommendation(
  recommendation: ApiRecommendationRead,
  movie: ApiMovie | Movie,
): MovieRecommendation {
  return {
    movie: 'movie_id' in movie ? mapApiMovie(movie) : movie,
    id: recommendation.id,
    userId: recommendation.user_id,
    filmeId: recommendation.filme_id,
    similarityScore: toNumber(recommendation.similarity_score),
    rankPosition: recommendation.rank_position,
    recommendedAt: recommendation.recommended_at ?? undefined,
  };
}

function toNumber(value: number | string): number {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

