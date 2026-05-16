import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import { Movie } from '../../core/models/movie';
import { ExperienceTrackingService } from '../../core/services/experience-tracking.service';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import { RecommendationsPage } from './recommendations.page';

describe('RecommendationsPage', () => {
  let fixture: ComponentFixture<RecommendationsPage>;
  let component: RecommendationsPage;
  let httpMock: HttpTestingController;
  let experienceTrackingService: ExperienceTrackingService;
  let participantSessionService: ParticipantSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationsPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    experienceTrackingService = TestBed.inject(ExperienceTrackingService);
    participantSessionService = TestBed.inject(ParticipantSessionService);
    participantSessionService.reset();
    participantSessionService.setBackendUserId(42);

    fixture = TestBed.createComponent(RecommendationsPage);
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

  it('shows the exact affinity poster chips only on the top three recommendations', () => {
    flushRecommendations(MOCK_MOVIES.slice(0, 4));
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('Melhor correspondência para você');
    expect(textContent).toContain('Boa chance de agradar');
    expect(textContent).toContain('Entre os 3 mais compatíveis');
    expect(textContent).toContain('Recomendado pelo seu perfil');

    for (const card of component.recommendationCards()) {
      expect(card.evidenceBadges.length).toBeLessThanOrEqual(1);
      expect(card.evidenceBadges.map((badge) => badge.label)).not.toEqual(
        expect.arrayContaining([
          'Melhor correspondência para você',
          'Boa chance de agradar',
          'Entre os 3 mais compatíveis',
        ]),
      );
    }
  });

  it('adds the best rated badge to the highest rated movie on the current page only', () => {
    const movies = MOCK_MOVIES.slice(0, 12).map((movie, index) => ({
      ...movie,
      averageRating: index === 3 ? 4.9 : index === 11 ? 5 : 3,
      popularity: 0,
      ratingCount: 0,
      year: 2005,
    }));

    flushRecommendations(movies);

    expect(component.paginatedRecommendationCards().map((card) => card.movie.id)).toEqual(
      movies.slice(0, 10).map((movie) => movie.id),
    );
    expect(paginatedEvidenceLabelsFor(3)).toEqual(['Mais bem avaliado']);
    expect(component.paginatedRecommendationCards()[3].movie.id).toBe(movies[3].id);
    expect(component.recommendationCards().map((card) => card.movie.id)).toEqual(
      movies.map((movie) => movie.id),
    );
    expect(component.recommendationCards().some((card) => evidenceLabelsForCard(card).includes('Mais bem avaliado'))).toBe(
      false,
    );

    component.goToNextRecommendationPage();

    expect(component.paginatedRecommendationCards().map((card) => card.movie.id)).toEqual(
      movies.slice(10, 12).map((movie) => movie.id),
    );
    expect(paginatedEvidenceLabelsFor(1)).toEqual(['Mais bem avaliado']);
  });

  it('does not add a best rated badge when the current page has no valid ratings', () => {
    flushRecommendations(
      MOCK_MOVIES.slice(0, 3).map((movie) => ({
        ...movie,
        averageRating: undefined,
        popularity: 0,
        ratingCount: 0,
        year: 2005,
      })),
    );

    expect(
      component
        .paginatedRecommendationCards()
        .some((card) => evidenceLabelsForCard(card).includes('Mais bem avaliado')),
    ).toBe(false);
  });

  it('tracks a selected page-scoped best rated movie as best_rated', () => {
    const movies = MOCK_MOVIES.slice(0, 6).map((movie, index) => ({
      ...movie,
      averageRating: index === 4 ? 5 : 3,
      popularity: 0,
      ratingCount: 0,
      year: 2005,
    }));

    flushRecommendations(movies);

    component.toggleWouldWatch(movies[4].id);

    const events = experienceTrackingService.events();
    const movieSelectedEvent = events[events.length - 1];

    expect(movieSelectedEvent.name).toBe('movie_selected');
    if (movieSelectedEvent.name === 'movie_selected') {
      expect(movieSelectedEvent.payload.persuasive_stimulus_type).toBe('best_rated');
    }
    flushEvents();
  });

  it('highlights only the top 20 percent by popularity and rating count', () => {
    const movies = MOCK_MOVIES.slice(0, 10).map((movie, index) => ({
      ...movie,
      averageRating: index === 0 ? 5 : 4,
      popularity: index === 3 || index === 4 ? 100 - index : 1,
      ratingCount: index === 5 || index === 6 ? 9000 - index : 10,
      runtime: 110,
      year: 2005,
    }));

    flushRecommendations(movies);

    expect(evidenceLabelsFor(3)).toContain('Popular entre usuários');
    expect(evidenceLabelsFor(4)).toContain('Popular entre usuários');
    expect(evidenceLabelsFor(5)).toContain('Muitas avaliações');
    expect(evidenceLabelsFor(6)).toContain('Muitas avaliações');
    expect(evidenceLabelsFor(7)).not.toContain('Popular entre usuários');
    expect(evidenceLabelsFor(7)).not.toContain('Muitas avaliações');
  });

  it('does not add runtime badges', () => {
    const movies = [
      movieWith(MOCK_MOVIES[0], { popularity: 0, ratingCount: 0, runtime: 80, year: 2005 }),
      movieWith(MOCK_MOVIES[1], { popularity: 0, ratingCount: 0, runtime: 110, year: 2005 }),
      movieWith(MOCK_MOVIES[2], { popularity: 0, ratingCount: 0, runtime: 160, year: 2005 }),
    ];

    flushRecommendations(movies);

    expect(evidenceLabelsFor(0)).not.toContain('Filme curto');
    expect(evidenceLabelsFor(1)).not.toContain('Duração média');
    expect(evidenceLabelsFor(1)).not.toContain('Filme curto');
    expect(evidenceLabelsFor(1)).not.toContain('Filme longo');
    expect(evidenceLabelsFor(2)).not.toContain('Filme longo');
  });

  it('adds period badges for 90s movies and classics only', () => {
    const currentYear = new Date().getFullYear();
    const movies = [
      movieWith(MOCK_MOVIES[0], { averageRating: 5, year: currentYear }),
      movieWith(MOCK_MOVIES[1], { averageRating: 4, year: 1995 }),
      movieWith(MOCK_MOVIES[2], { averageRating: 3, year: 1985 }),
    ];

    flushRecommendations(movies);

    expect(evidenceLabelsFor(0)).not.toContain('Lançamento recente');
    expect(evidenceLabelsFor(1)).toContain('Anos 90');
    expect(evidenceLabelsFor(2)).toContain('Clássico');
  });

  it('does not create empty evidence badges when optional data is missing', () => {
    flushRecommendations([
      movieWith(MOCK_MOVIES[0], {
        popularity: undefined,
        ratingCount: 0,
        runtime: undefined,
        year: undefined,
      }),
    ]);

    expect(component.recommendationCards()[0].evidenceBadges.every((badge) => badge.label)).toBe(
      true,
    );
  });

  function flushRecommendations(movies: Movie[]): void {
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

  function evidenceLabelsFor(index: number): string[] {
    return component.recommendationCards()[index].evidenceBadges.map((badge) => badge.label);
  }

  function paginatedEvidenceLabelsFor(index: number): string[] {
    return evidenceLabelsForCard(component.paginatedRecommendationCards()[index]);
  }

  function evidenceLabelsForCard(card: { evidenceBadges: { label: string }[] }): string[] {
    return card.evidenceBadges.map((badge) => badge.label);
  }

  function movieWith(movie: Movie, overrides: Partial<Movie>): Movie {
    return { ...movie, ...overrides };
  }

  function toApiMovie(movie: Movie) {
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
