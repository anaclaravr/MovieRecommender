import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Movie } from '../models/movie';
import { API_BASE_URL } from './api.config';
import { ApiMovie, ApiPage } from './api-types';

export interface MovieListParams {
  page: number;
  size: number;
  titulo?: string;
  genero?: string;
}

export interface MoviePage {
  items: Movie[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

@Injectable({ providedIn: 'root' })
export class MovieApiService {
  private readonly http = inject(HttpClient);

  listMovies(params: MovieListParams): Observable<MoviePage> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);

    if (params.titulo) {
      httpParams = httpParams.set('titulo', params.titulo);
    }

    if (params.genero && params.genero !== 'all') {
      httpParams = httpParams.set('genero', params.genero);
    }

    return this.http
      .get<ApiPage<ApiMovie>>(`${API_BASE_URL}/filmes/`, { params: httpParams })
      .pipe(map((page) => ({ ...page, items: page.items.map(mapApiMovie) })));
  }

  getMovie(movieId: number): Observable<Movie> {
    return this.http.get<ApiMovie>(`${API_BASE_URL}/filmes/${movieId}`).pipe(map(mapApiMovie));
  }
}

export function mapApiMovie(movie: ApiMovie): Movie {
  return {
    id: movie.id,
    movieId: movie.movie_id,
    tmdbId: movie.tmdb_id ?? undefined,
    title: movie.title_translation?.trim() || movie.title,
    originalTitle: movie.title,
    titleTranslation: movie.title_translation ?? undefined,
    year: movie.year ?? undefined,
    genres: movie.genres ?? [],
    posterUrl: movie.poster_url ?? undefined,
    averageRating: toOptionalNumber(movie.average_rating),
    ratingCount: movie.rating_count,
    popularity: toOptionalNumber(movie.popularity),
    runtime: movie.runtime ?? undefined,
    synopsis: movie.synopsis ?? undefined,
  };
}

function toOptionalNumber(value: number | string | null | undefined): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

