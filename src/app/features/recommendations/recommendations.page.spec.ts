import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import { RecommendationsPage } from './recommendations.page';

describe('RecommendationsPage', () => {
  let component: RecommendationsPage;
  let httpMock: HttpTestingController;
  let participantSessionService: ParticipantSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationsPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    participantSessionService = TestBed.inject(ParticipantSessionService);
    participantSessionService.reset();
    participantSessionService.setBackendUserId(42);

    const fixture = TestBed.createComponent(RecommendationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    flushEvents();
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('shows loading until recommendations are loaded', () => {
    expect(component.isLoadingRecommendations()).toBe(true);

    flushRecommendations(MOCK_MOVIES.slice(0, 3));

    expect(component.isLoadingRecommendations()).toBe(false);
    expect(component.recommendationCards().map((card) => card.movie.id)).toEqual(
      MOCK_MOVIES.slice(0, 3).map((movie) => movie.id),
    );
  });

  it('shows the recommendation error only after the API fails', () => {
    expect(component.hasNoRecommendations()).toBe(false);

    const requests = recommendationRequests();
    requests.movies.flush([]);
    requests.recommendations.flush('Erro', { status: 500, statusText: 'Server Error' });

    expect(component.isLoadingRecommendations()).toBe(false);
    expect(component.hasNoRecommendations()).toBe(true);
    expect(component.apiError()).toBe('Não foi possível carregar as recomendações da API.');
  });

  it('announces local pagination changes and closes details', () => {
    vi.useFakeTimers();

    flushRecommendations(MOCK_MOVIES.slice(0, 12));

    component.openDetails(MOCK_MOVIES[0].id);
    flushEvents();
    component.goToNextRecommendationPage();

    expect(component.currentRecommendationPageIndex()).toBe(1);
    expect(component.detailsCard()).toBeNull();

    vi.advanceTimersByTime(900);
  });

  function flushRecommendations(movies: typeof MOCK_MOVIES): void {
    const requests = recommendationRequests();

    requests.recommendations.flush(
      movies.map((movie, index) => ({
        id: index + 1,
        user_id: 42,
        filme_id: movie.id,
        similarity_score: 1 - index / 100,
        rank_position: index + 1,
        recommended_at: null,
      })),
    );
    requests.movies.flush(movies.map(toApiMovie));
  }

  function recommendationRequests() {
    const recommendations = httpMock.expectOne((req) =>
      req.url.endsWith('/users/42/recomendacoes/'),
    );
    const movies = httpMock.expectOne((req) =>
      req.url.endsWith('/users/42/recomendacoes/filmes/'),
    );

    return { recommendations, movies };
  }

  function flushEvents(): void {
    const requests = httpMock.match((req) => req.url.endsWith('/eventos/'));

    for (const request of requests) {
      request.flush({});
    }
  }

  function toApiMovie(movie: (typeof MOCK_MOVIES)[number]) {
    return {
      id: movie.id,
      movie_id: movie.movieId,
      tmdb_id: movie.tmdbId ?? null,
      title: movie.originalTitle ?? movie.title,
      title_translation: movie.titleTranslation ?? null,
      year: movie.year ?? null,
      genres: movie.genres,
      poster_url: movie.posterUrl ?? null,
      average_rating: movie.averageRating ?? null,
      rating_count: movie.ratingCount,
      popularity: movie.popularity ?? null,
      runtime: movie.runtime ?? null,
      synopsis: movie.synopsis ?? null,
    };
  }
});
