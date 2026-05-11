import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

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
  });

  it('filters movies by title and genre', () => {
    component.updateSearchQuery('inter');
    flushMovies([MOCK_MOVIES[6]]);

    expect(component.filteredCards().map((card) => card.movie.id)).toEqual([MOCK_MOVIES[6].id]);

    component.updateSearchQuery('');
    flushMovies(MOCK_MOVIES);
    component.selectGenre('Adventure');
    flushMovies(MOCK_MOVIES.filter((movie) => movie.genres.includes('Adventure')));

    expect(component.filteredCards().length).toBeGreaterThan(0);
    expect(component.filteredCards().every((card) => card.movie.genres.includes('Adventure'))).toBe(
      true,
    );
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

  function flushMovies(movies: typeof MOCK_MOVIES): void {
    const request = httpMock.expectOne((req) => req.url.endsWith('/filmes/'));

    expect(request.request.params.has('ordenacao')).toBe(false);

    request.flush({
      items: movies.map((movie) => ({
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
      })),
      total: movies.length,
      page: 1,
      size: 10,
      pages: 1,
    });
  }
});
