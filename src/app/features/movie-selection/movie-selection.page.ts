import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import { Movie } from '../../core/models/movie';
import { ParticipantSessionService } from '../../core/services/participant-session.service';

type GenreFilterId = 'all' | string;
type DetailsContrast = 'light' | 'dark';

interface GenreFilterOption {
  id: GenreFilterId;
  label: string;
  iconClass: string;
}

interface MovieSelectionCard {
  movie: Movie;
  posterGradient: string;
  posterImage: string;
  detailsContrast: DetailsContrast;
  genresLabel: string;
}

const MAX_SELECTED_MOVIES = 5;
const ALL_GENRES_ID: GenreFilterId = 'all';
const LIGHT_DETAILS_CARD_INDEXES = new Set([1, 6]);
const POSTER_GRADIENTS = [
  'linear-gradient(160deg, #14344f 0%, #325b78 46%, #d2dfeb 100%)',
  'linear-gradient(160deg, #f0e8df 0%, #d4c6b1 48%, #8d6d4f 100%)',
  'linear-gradient(160deg, #451a1d 0%, #b53b2f 48%, #f1a13a 100%)',
  'linear-gradient(160deg, #17193f 0%, #5339ac 48%, #9ea7f0 100%)',
  'linear-gradient(160deg, #5b1016 0%, #a82b1e 44%, #f3c14e 100%)',
  'linear-gradient(160deg, #0f1d33 0%, #204b74 44%, #ff7d32 100%)',
  'linear-gradient(160deg, #b5c1cb 0%, #edf2f5 48%, #7f8f99 100%)',
  'linear-gradient(160deg, #183149 0%, #446c8d 48%, #9ec3de 100%)'
] as const;
const GENRE_LABELS: Record<string, string> = {
  Action: 'Acao',
  Adventure: 'Aventura',
  Animation: 'Animacao',
  Comedy: 'Comedia',
  Drama: 'Drama',
  Family: 'Familia',
  Horror: 'Terror',
  Mystery: 'Misterio',
  Romance: 'Romance',
  'Science Fiction': 'Ficcao cientifica',
  Thriller: 'Thriller'
};
const GENRE_ICON_CLASSES: Record<string, string> = {
  [ALL_GENRES_ID]: 'pi pi-sparkles',
  Action: 'pi pi-bolt',
  Adventure: 'pi pi-compass',
  Animation: 'pi pi-palette',
  Comedy: 'pi pi-face-smile',
  Drama: 'pi pi-book',
  Family: 'pi pi-users',
  Horror: 'pi pi-moon',
  Mystery: 'pi pi-eye',
  Romance: 'pi pi-heart',
  'Science Fiction': 'pi pi-globe',
  Thriller: 'pi pi-camera'
};
const SELECTION_LIMIT_HINT =
  'Voce ja selecionou 5 filmes. Remova um para escolher outro.';

function getGenreLabel(genre: string): string {
  return GENRE_LABELS[genre] ?? genre;
}

function getGenreIconClass(genre: GenreFilterId): string {
  return GENRE_ICON_CLASSES[genre] ?? 'pi pi-tag';
}

const MOVIE_SELECTION_CARDS: MovieSelectionCard[] = MOCK_MOVIES.map((movie, index) => ({
  movie,
  posterGradient: POSTER_GRADIENTS[index % POSTER_GRADIENTS.length],
  posterImage: `url("${movie.posterUrl}")`,
  detailsContrast: LIGHT_DETAILS_CARD_INDEXES.has(index) ? 'light' : 'dark',
  genresLabel: movie.genres.map((genre) => getGenreLabel(genre)).join(' • ')
}));

const MOVIE_CARD_BY_ID = new Map(MOVIE_SELECTION_CARDS.map((card) => [card.movie.id, card]));
const GENRE_OPTIONS: GenreFilterOption[] = [
  { id: ALL_GENRES_ID, label: 'Todos', iconClass: getGenreIconClass(ALL_GENRES_ID) },
  ...Array.from(new Set(MOCK_MOVIES.flatMap((movie) => movie.genres)))
    .sort((left, right) => getGenreLabel(left).localeCompare(getGenreLabel(right)))
    .map((genre) => ({
      id: genre,
      label: getGenreLabel(genre),
      iconClass: getGenreIconClass(genre)
    }))
];

function normalizeSelectedMovieIds(ids: string[]): string[] {
  return Array.from(new Set(ids))
    .filter((id) => MOVIE_CARD_BY_ID.has(id))
    .slice(0, MAX_SELECTED_MOVIES);
}

function hasSameIds(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

@Component({
  selector: 'app-movie-selection-page',
  templateUrl: './movie-selection.page.html',
  styleUrl: './movie-selection.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieSelectionPage {
  private readonly participantSessionService = inject(ParticipantSessionService);
  private readonly router = inject(Router);

  readonly selectionSteps = [1, 2, 3, 4, 5];
  readonly maxSelectedMovies = MAX_SELECTED_MOVIES;
  readonly genreOptions = GENRE_OPTIONS;
  readonly session = this.participantSessionService.session;
  readonly selectionLimitHint = SELECTION_LIMIT_HINT;
  readonly searchQuery = signal('');
  readonly activeGenreId = signal<GenreFilterId>(ALL_GENRES_ID);
  readonly expandedMovieId = signal<string | null>(null);
  readonly isDrawerOpen = signal(false);
  readonly showSelectionLimitHint = signal(false);
  readonly viewportWidth = signal(typeof window === 'undefined' ? 1440 : window.innerWidth);

  readonly selectedMovieIds = computed(() =>
    normalizeSelectedMovieIds(this.session().selectedSeedMovieIds)
  );
  readonly selectedMovieIdSet = computed(() => new Set(this.selectedMovieIds()));
  readonly selectedCount = computed(() => this.selectedMovieIds().length);
  readonly canContinue = computed(() => this.selectedCount() === this.maxSelectedMovies);
  readonly activeGenreLabel = computed(
    () =>
      this.genreOptions.find((genre) => genre.id === this.activeGenreId())?.label ??
      this.genreOptions[0].label
  );
  readonly filteredCards = computed(() => {
    const normalizedSearch = this.searchQuery().trim().toLowerCase();
    const activeGenreId = this.activeGenreId();

    return MOVIE_SELECTION_CARDS.filter((card) => {
      const matchesSearch = normalizedSearch
        ? card.movie.title.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesGenre =
        activeGenreId === ALL_GENRES_ID ? true : card.movie.genres.includes(activeGenreId);

      return matchesSearch && matchesGenre;
    });
  });
  readonly selectedCards = computed(() =>
    this.selectedMovieIds()
      .map((movieId) => MOVIE_CARD_BY_ID.get(movieId))
      .filter((card): card is MovieSelectionCard => Boolean(card))
  );
  readonly hasNoResults = computed(() => this.filteredCards().length === 0);
  readonly emptyStateMessage = computed(() => {
    const normalizedSearch = this.searchQuery().trim();
    const hasSearch = normalizedSearch.length > 0;
    const hasGenre = this.activeGenreId() !== ALL_GENRES_ID;

    if (hasSearch && hasGenre) {
      return `Nenhum filme encontrado para "${normalizedSearch}" em ${this.activeGenreLabel()}.`;
    }

    if (hasSearch) {
      return `Nenhum filme encontrado para "${normalizedSearch}".`;
    }

    if (hasGenre) {
      return `Nenhum filme encontrado em ${this.activeGenreLabel()}.`;
    }

    return 'Nenhum filme disponivel no momento.';
  });

  constructor() {
    const normalizedIds = normalizeSelectedMovieIds(this.session().selectedSeedMovieIds);

    if (!hasSameIds(normalizedIds, this.session().selectedSeedMovieIds)) {
      this.participantSessionService.setSelectedSeedMovieIds(normalizedIds);
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.isDrawerOpen()) {
      this.closeDrawer();
      return;
    }

    if (this.expandedMovieId()) {
      this.closeExpandedDetails();
    }
  }

  @HostListener('window:resize')
  handleWindowResize(): void {
    if (typeof window !== 'undefined') {
      this.viewportWidth.set(window.innerWidth);
    }
  }

  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.showSelectionLimitHint.set(false);
  }

  selectGenre(genreId: GenreFilterId): void {
    this.activeGenreId.set(genreId);
    this.showSelectionLimitHint.set(false);
  }

  toggleMovieSelection(movieId: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    const selectedMovieIds = this.selectedMovieIds();

    if (selectedMovieIds.includes(movieId)) {
      this.updateSelectedMovieIds(selectedMovieIds.filter((selectedId) => selectedId !== movieId));
      return;
    }

    if (selectedMovieIds.length >= this.maxSelectedMovies) {
      this.showSelectionLimitHint.set(true);
      return;
    }

    this.updateSelectedMovieIds([...selectedMovieIds, movieId]);
  }

  removeSelectedMovie(movieId: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.updateSelectedMovieIds(
      this.selectedMovieIds().filter((selectedId) => selectedId !== movieId)
    );
  }

  toggleMovieDetails(movieId: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.expandedMovieId.update((currentMovieId) => (currentMovieId === movieId ? null : movieId));
  }

  closeExpandedDetails(): void {
    this.expandedMovieId.set(null);
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  onCardKeydown(event: KeyboardEvent, movieId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMovieSelection(movieId);
    }
  }

  continueToLoading(): void {
    if (!this.canContinue()) {
      return;
    }

    void this.router.navigateByUrl('/loading');
  }

  isGenreActive(genreId: GenreFilterId): boolean {
    return this.activeGenreId() === genreId;
  }

  isMovieSelected(movieId: string): boolean {
    return this.selectedMovieIdSet().has(movieId);
  }

  isSelectionBlocked(movieId: string): boolean {
    return !this.isMovieSelected(movieId) && this.selectedCount() >= this.maxSelectedMovies;
  }

  isDetailsExpanded(movieId: string): boolean {
    return this.expandedMovieId() === movieId;
  }

  shouldHideCardForExpandedRow(movieId: string): boolean {
    const expandedMovieId = this.expandedMovieId();

    if (!expandedMovieId || expandedMovieId === movieId || this.currentGridColumns() === 1) {
      return false;
    }

    const cards = this.filteredCards();
    const movieIndex = cards.findIndex((card) => card.movie.id === movieId);
    const expandedMovieIndex = cards.findIndex((card) => card.movie.id === expandedMovieId);

    if (movieIndex === -1 || expandedMovieIndex === -1) {
      return false;
    }

    return (
      Math.floor(movieIndex / this.currentGridColumns()) ===
      Math.floor(expandedMovieIndex / this.currentGridColumns())
    );
  }

  private updateSelectedMovieIds(ids: string[]): void {
    this.participantSessionService.setSelectedSeedMovieIds(normalizeSelectedMovieIds(ids));
    this.showSelectionLimitHint.set(false);
  }

  private currentGridColumns(): number {
    const width = this.viewportWidth();

    if (width <= 720) {
      return 1;
    }

    if (width <= 1080) {
      return 2;
    }

    if (width <= 1240) {
      return 3;
    }

    return 4;
  }
}
