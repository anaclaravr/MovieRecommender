import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import { NeutralExperiencePage } from './neutral-experience.page';

describe('NeutralExperiencePage', () => {
  let component: NeutralExperiencePage;
  let participantSessionService: ParticipantSessionService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeutralExperiencePage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    participantSessionService = TestBed.inject(ParticipantSessionService);
    participantSessionService.reset();
    httpMock = TestBed.inject(HttpTestingController);

    const fixture = TestBed.createComponent(NeutralExperiencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    flushMovies(MOCK_MOVIES);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('filters movies by title and genre', () => {
    vi.useFakeTimers();

    component.updateSearchQuery('inter');

    expect(component.searchInputQuery()).toBe('inter');
    expect(component.searchQuery()).toBe('');
    vi.advanceTimersByTime(299);
    httpMock.expectNone((req) => req.url.endsWith('/filmes/'));

    vi.advanceTimersByTime(1);
    flushMovies([MOCK_MOVIES[6]], 1, 'inter');

    expect(component.filteredCards().map((card) => card.movie.id)).toEqual([MOCK_MOVIES[6].id]);

    component.updateSearchQuery('');
    vi.advanceTimersByTime(300);
    flushMovies(MOCK_MOVIES);
    component.selectGenre('Adventure');
    flushMovies(
      MOCK_MOVIES.filter((movie) => movie.genres.includes('Adventure')),
      1,
      undefined,
      'Adventure',
    );

    expect(component.filteredCards().length).toBeGreaterThan(0);
    expect(component.filteredCards().every((card) => card.movie.genres.includes('Adventure'))).toBe(
      true,
    );
    vi.advanceTimersByTime(300);
  });

  it('syncs unlimited neutral selections to the participant session', () => {
    const firstSixMovieIds = MOCK_MOVIES.slice(0, 6).map((movie) => movie.id);

    for (const movieId of firstSixMovieIds) {
      component.toggleWouldWatch(movieId);
    }

    expect(component.selectedMovieIds()).toEqual(firstSixMovieIds);
    expect(participantSessionService.session().selectedNeutralMovieIds).toEqual(firstSixMovieIds);

    component.toggleWouldWatch(firstSixMovieIds[1]);

    expect(component.selectedMovieIds()).toEqual([
      firstSixMovieIds[0],
      ...firstSixMovieIds.slice(2),
    ]);
  });

  it('ignores older movie responses after a newer request starts', () => {
    vi.useFakeTimers();

    component.updateSearchQuery('inter');
    vi.advanceTimersByTime(300);

    component.updateSearchQuery('matrix');
    vi.advanceTimersByTime(300);

    const requests = httpMock.match((req) => req.url.endsWith('/filmes/'));
    expect(requests.length).toBe(2);
    expect(requests[0].request.params.get('titulo')).toBe('inter');
    expect(requests[0].request.params.get('ordenacao')).toBe('relevancia_neutra');
    expect(requests[1].request.params.get('titulo')).toBe('matrix');
    expect(requests[1].request.params.get('ordenacao')).toBe('relevancia_neutra');

    requests[0].flush({
      items: [toApiMovie(MOCK_MOVIES[6])],
      total: 1,
      page: 1,
      size: 10,
      pages: 1,
    });

    expect(component.isLoadingMovies()).toBe(true);
    expect(component.filteredCards().map((card) => card.movie.id)).not.toEqual([
      MOCK_MOVIES[6].id,
    ]);

    requests[1].flush({
      items: [toApiMovie(MOCK_MOVIES[0])],
      total: 1,
      page: 1,
      size: 10,
      pages: 1,
    });

    expect(component.isLoadingMovies()).toBe(false);
    expect(component.filteredCards().map((card) => card.movie.id)).toEqual([MOCK_MOVIES[0].id]);
    vi.advanceTimersByTime(300);
  });

  function flushMovies(
    movies: typeof MOCK_MOVIES,
    expectedPage = 1,
    expectedTitle?: string,
    expectedGenre?: string,
  ): void {
    const request = httpMock.expectOne((req) => req.url.endsWith('/filmes/'));
    const expectedOrdering = expectedTitle ? 'relevancia_neutra' : undefined;

    expect(request.request.params.get('ordenacao') ?? undefined).toBe(expectedOrdering);
    expect(request.request.params.get('page')).toBe(expectedPage.toString());
    expect(request.request.params.get('titulo') ?? undefined).toBe(expectedTitle);
    expect(request.request.params.get('genero') ?? undefined).toBe(expectedGenre);

    request.flush({
      items: movies.map(toApiMovie),
      total: movies.length,
      page: expectedPage,
      size: 10,
      pages: 1,
    });
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
