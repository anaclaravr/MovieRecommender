import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import { MovieSelectionPage } from './movie-selection.page';

describe('MovieSelectionPage', () => {
  let component: MovieSelectionPage;
  let participantSessionService: ParticipantSessionService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieSelectionPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    participantSessionService = TestBed.inject(ParticipantSessionService);
    participantSessionService.reset();
    httpMock = TestBed.inject(HttpTestingController);

    const fixture = TestBed.createComponent(MovieSelectionPage);
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

  it('exposes an icon class for each genre filter option', () => {
    expect(component.genreOptions.length).toBeGreaterThan(0);
    expect(component.genreOptions.every((genre) => genre.iconClass.startsWith('pi pi-'))).toBe(
      true,
    );
    expect(component.genreOptions.find((genre) => genre.id === 'all')?.iconClass).toBe(
      'pi pi-sparkles',
    );
  });

  it('syncs selected movies to the session and prevents selecting a sixth movie', () => {
    const firstFiveMovieIds = MOCK_MOVIES.slice(0, 5).map((movie) => movie.id);

    for (const movieId of firstFiveMovieIds) {
      component.toggleMovieSelection(movieId);
    }

    expect(component.selectedMovieIds()).toEqual(firstFiveMovieIds);
    expect(participantSessionService.session().selectedSeedMovieIds).toEqual(firstFiveMovieIds);
    expect(component.canContinue()).toBe(true);

    component.toggleMovieSelection(MOCK_MOVIES[5].id);

    expect(component.selectedMovieIds()).toEqual(firstFiveMovieIds);
    expect(component.showSelectionLimitHint()).toBe(true);
    expect(participantSessionService.session().selectedSeedMovieIds).toEqual(firstFiveMovieIds);
  });

  it('allows removing a selected movie and updating the selection state', () => {
    const selectedMovieIds = MOCK_MOVIES.slice(0, 3).map((movie) => movie.id);

    for (const movieId of selectedMovieIds) {
      component.toggleMovieSelection(movieId);
    }

    component.removeSelectedMovie(selectedMovieIds[1]);

    expect(component.selectedMovieIds()).toEqual([selectedMovieIds[0], selectedMovieIds[2]]);
    expect(component.selectedCount()).toBe(2);
    expect(component.canContinue()).toBe(false);
    expect(participantSessionService.session().selectedSeedMovieIds).toEqual([
      selectedMovieIds[0],
      selectedMovieIds[2],
    ]);
  });

  it('clears all selected movies from the drawer action', () => {
    const selectedMovieIds = MOCK_MOVIES.slice(0, 3).map((movie) => movie.id);

    for (const movieId of selectedMovieIds) {
      component.toggleMovieSelection(movieId);
    }

    component.clearSelectedMovies();

    expect(component.selectedMovieIds()).toEqual([]);
    expect(component.selectedCount()).toBe(0);
    expect(component.canContinue()).toBe(false);
    expect(participantSessionService.session().selectedSeedMovieIds).toEqual([]);
  });

  it('keeps the drawer closed by default and toggles it on demand', () => {
    expect(component.isDrawerOpen()).toBe(false);

    component.openDrawer();
    expect(component.isDrawerOpen()).toBe(true);

    component.closeDrawer();
    expect(component.isDrawerOpen()).toBe(false);
  });

  it('hydrates selected drawer cards when the selected ids were restored from the session', () => {
    const restoredMovieIds = MOCK_MOVIES.slice(10, 12).map((movie) => movie.id);
    participantSessionService.setSelectedSeedMovieIds(restoredMovieIds);

    const restoredFixture = TestBed.createComponent(MovieSelectionPage);
    const restoredComponent = restoredFixture.componentInstance;
    restoredFixture.detectChanges();
    flushMovies(MOCK_MOVIES.slice(0, 5));

    expect(restoredComponent.selectedCount()).toBe(2);
    expect(restoredComponent.selectedCards()).toEqual([]);

    for (const movie of MOCK_MOVIES.slice(10, 12)) {
      flushMovie(movie);
    }

    expect(restoredComponent.selectedCards().map((card) => card.movie.id)).toEqual(
      restoredMovieIds,
    );
  });

  it('expands movie details inline instead of using a separate modal state', () => {
    const targetMovieId = MOCK_MOVIES[0].id;

    expect(component.isDetailsExpanded(targetMovieId)).toBe(false);

    component.toggleMovieDetails(targetMovieId);
    expect(component.isDetailsExpanded(targetMovieId)).toBe(true);

    component.toggleMovieDetails(targetMovieId);
    expect(component.isDetailsExpanded(targetMovieId)).toBe(false);
  });

  it('resets pagination and reloads movies when changing ordering', () => {
    component.goToNextMoviePage();
    flushMovies(MOCK_MOVIES, 'recentes_popularidade', 2);
    expect(component.currentMoviePageIndex()).toBe(1);

    component.toggleMovieDetails(MOCK_MOVIES[0].id);
    component.updateMovieOrdering('popularidade_recentes');
    flushMovies(MOCK_MOVIES, 'popularidade_recentes', 1);

    expect(component.currentMoviePageIndex()).toBe(0);
    expect(component.isDetailsExpanded(MOCK_MOVIES[0].id)).toBe(false);
    expect(component.activeMovieOrdering()).toBe('popularidade_recentes');
  });

  it('keeps a second-row movie on the second row when switching expanded details', () => {
    component.viewportWidth.set(1440);

    const firstExpandedMovieId = MOCK_MOVIES[2].id;
    const secondExpandedMovieId = MOCK_MOVIES[3].id;

    component.toggleMovieDetails(firstExpandedMovieId);
    component.toggleMovieDetails(secondExpandedMovieId);

    const visualMovieIds = component
      .paginatedCards()
      .map((card) => card.movie.id)
      .sort((leftMovieId, rightMovieId) => {
        return component.movieCardOrder(leftMovieId) - component.movieCardOrder(rightMovieId);
      });

    expect(component.movieCardOrder(secondExpandedMovieId)).toBe(5);
    expect(visualMovieIds.slice(0, 5)).toEqual([
      MOCK_MOVIES[2].id,
      MOCK_MOVIES[0].id,
      MOCK_MOVIES[1].id,
      MOCK_MOVIES[4].id,
      MOCK_MOVIES[5].id,
    ]);
  });

  function flushMovies(
    movies: typeof MOCK_MOVIES,
    expectedOrdering = 'recentes_popularidade',
    expectedPage = 1,
  ): void {
    const request = httpMock.expectOne((req) => req.url.endsWith('/filmes/'));

    expect(request.request.params.get('ordenacao')).toBe(expectedOrdering);
    expect(request.request.params.get('page')).toBe(expectedPage.toString());

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
      page: expectedPage,
      size: 10,
      pages: 1,
    });
  }

  function flushMovie(movie: (typeof MOCK_MOVIES)[number]): void {
    const request = httpMock.expectOne((req) => req.url.endsWith(`/filmes/${movie.id}`));

    request.flush({
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
    });
  }
});
