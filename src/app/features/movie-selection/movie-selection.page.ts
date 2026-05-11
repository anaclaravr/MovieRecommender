import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { MovieApiService, MovieOrdering } from '../../core/api/movie-api.service';
import { RecommendationApiService } from '../../core/api/recommendation-api.service';
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
  durationLabel: string;
  ratingLabel: string;
}

interface MovieOrderingOption {
  id: MovieOrdering;
  label: string;
}

const MAX_SELECTED_MOVIES = 5;
const MOVIE_SELECTION_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;
const DEFAULT_MOVIE_ORDERING: MovieOrdering = 'recentes_popularidade';
const ALL_GENRES_ID: GenreFilterId = 'all';
const GENRE_EDGE_HOVER_THRESHOLD = 96;
const GENRE_DRAG_THRESHOLD = 6;
const LIGHT_DETAILS_CARD_INDEXES = new Set([1, 6]);
const POSTER_GRADIENTS = [
  'linear-gradient(160deg, #14344f 0%, #325b78 46%, #d2dfeb 100%)',
  'linear-gradient(160deg, #f0e8df 0%, #d4c6b1 48%, #8d6d4f 100%)',
  'linear-gradient(160deg, #451a1d 0%, #b53b2f 48%, #f1a13a 100%)',
  'linear-gradient(160deg, #17193f 0%, #5339ac 48%, #9ea7f0 100%)',
  'linear-gradient(160deg, #5b1016 0%, #a82b1e 44%, #f3c14e 100%)',
  'linear-gradient(160deg, #0f1d33 0%, #204b74 44%, #ff7d32 100%)',
  'linear-gradient(160deg, #b5c1cb 0%, #edf2f5 48%, #7f8f99 100%)',
  'linear-gradient(160deg, #183149 0%, #446c8d 48%, #9ec3de 100%)',
] as const;
const DEFAULT_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Children',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Film-Noir',
  'Horror',
  'IMAX',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
] as const;
const GENRE_LABELS: Record<string, string> = {
  Action: 'Acao',
  Adventure: 'Aventura',
  Animation: 'Animacao',
  Children: 'Infantil',
  Comedy: 'Comedia',
  Crime: 'Crime',
  Documentary: 'Documentario',
  Drama: 'Drama',
  Fantasy: 'Fantasia',
  'Film-Noir': 'Film noir',
  Horror: 'Terror',
  IMAX: 'IMAX',
  Musical: 'Musical',
  Mystery: 'Misterio',
  Romance: 'Romance',
  'Sci-Fi': 'Ficcao cientifica',
  Thriller: 'Thriller',
  War: 'Guerra',
  Western: 'Faroeste',
};
const GENRE_ICON_CLASSES: Record<string, string> = {
  [ALL_GENRES_ID]: 'pi pi-sparkles',
  Action: 'pi pi-bolt',
  Adventure: 'pi pi-compass',
  Animation: 'pi pi-palette',
  Children: 'pi pi-users',
  Comedy: 'pi pi-face-smile',
  Crime: 'pi pi-shield',
  Documentary: 'pi pi-video',
  Drama: 'pi pi-book',
  Fantasy: 'pi pi-sparkles',
  'Film-Noir': 'pi pi-moon',
  Horror: 'pi pi-moon',
  IMAX: 'pi pi-desktop',
  Musical: 'pi pi-volume-up',
  Mystery: 'pi pi-eye',
  Romance: 'pi pi-heart',
  'Sci-Fi': 'pi pi-globe',
  Thriller: 'pi pi-camera',
  War: 'pi pi-flag',
  Western: 'pi pi-compass',
};
const SELECTION_LIMIT_HINT = 'Voce ja selecionou 5 filmes. Remova um para escolher outro.';
const GENRE_OPTIONS: GenreFilterOption[] = [
  { id: ALL_GENRES_ID, label: 'Todos', iconClass: getGenreIconClass(ALL_GENRES_ID) },
  ...DEFAULT_GENRES.map((genre) => ({
    id: genre,
    label: getGenreLabel(genre),
    iconClass: getGenreIconClass(genre),
  })),
];
const MOVIE_ORDERING_OPTIONS: MovieOrderingOption[] = [
  { id: 'recentes_popularidade', label: 'Mais recentes' },
  { id: 'popularidade_recentes', label: 'Mais populares' },
];

function getGenreLabel(genre: string): string {
  return GENRE_LABELS[genre] ?? genre;
}

function getGenreIconClass(genre: GenreFilterId): string {
  return GENRE_ICON_CLASSES[genre] ?? 'pi pi-tag';
}

function posterPlaceholder(title: string): string {
  return `https://placehold.co/320x480/e8eef5/102542?text=${encodeURIComponent(title)}`;
}

function formatRuntime(runtime?: number): string {
  if (!runtime) {
    return 'Nao informado';
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) {
    return `${minutes}min`;
  }

  return minutes ? `${hours}h ${minutes}min` : `${hours}h`;
}

function formatRating(rating?: number): string {
  return rating === undefined ? 'N/A' : rating.toFixed(1);
}

function createMovieSelectionCard(movie: Movie, index: number): MovieSelectionCard {
  return {
    movie,
    posterGradient: POSTER_GRADIENTS[index % POSTER_GRADIENTS.length],
    posterImage: `url("${movie.posterUrl ?? posterPlaceholder(movie.title)}")`,
    detailsContrast: LIGHT_DETAILS_CARD_INDEXES.has(index) ? 'light' : 'dark',
    genresLabel: movie.genres.map((genre) => getGenreLabel(genre)).join(' • '),
    durationLabel: formatRuntime(movie.runtime),
    ratingLabel: formatRating(movie.averageRating),
  };
}

function normalizeSelectedMovieIds(ids: number[]): number[] {
  return Array.from(new Set(ids)).slice(0, MAX_SELECTED_MOVIES);
}

function hasSameIds(left: number[], right: number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

@Component({
  selector: 'app-movie-selection-page',
  templateUrl: './movie-selection.page.html',
  styleUrl: './movie-selection.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieSelectionPage implements AfterViewInit, OnInit {
  @ViewChild('genreScroller') private genreScroller?: ElementRef<HTMLDivElement>;

  private readonly participantSessionService = inject(ParticipantSessionService);
  private readonly movieApiService = inject(MovieApiService);
  private readonly recommendationApiService = inject(RecommendationApiService);
  private readonly router = inject(Router);
  private genreDragPointerId: number | null = null;
  private genreDragStartX = 0;
  private genreDragStartScrollLeft = 0;
  private shouldSuppressGenreClick = false;

  readonly selectionSteps = [1, 2, 3, 4, 5];
  readonly maxSelectedMovies = MAX_SELECTED_MOVIES;
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly movieOrderingOptions = MOVIE_ORDERING_OPTIONS;
  readonly genreOptions = GENRE_OPTIONS;
  readonly session = this.participantSessionService.session;
  readonly selectionLimitHint = SELECTION_LIMIT_HINT;
  readonly searchQuery = signal('');
  readonly activeMovieOrdering = signal<MovieOrdering>(DEFAULT_MOVIE_ORDERING);
  readonly activeGenreId = signal<GenreFilterId>(ALL_GENRES_ID);
  readonly expandedMovieId = signal<number | null>(null);
  readonly expandedMovieRowStart = signal(0);
  readonly visualMovieOrderIds = signal<number[]>([]);
  readonly isDrawerOpen = signal(false);
  readonly showSelectionLimitHint = signal(false);
  readonly showContinueRequirementAlert = signal(false);
  readonly canScrollGenresLeft = signal(false);
  readonly canScrollGenresRight = signal(false);
  readonly isDraggingGenreScroller = signal(false);
  readonly genreEdgeHover = signal<'start' | 'end' | null>(null);
  readonly moviePageIndex = signal(0);
  readonly moviePageSize = signal(MOVIE_SELECTION_PAGE_SIZE);
  readonly viewportWidth = signal(typeof window === 'undefined' ? 1440 : window.innerWidth);
  readonly movieCards = signal<MovieSelectionCard[]>([]);
  readonly movieCache = signal<Map<number, MovieSelectionCard>>(new Map());
  readonly movieTotal = signal(0);
  readonly isLoadingMovies = signal(false);
  readonly apiError = signal('');

  readonly selectedMovieIds = computed(() =>
    normalizeSelectedMovieIds(this.session().selectedSeedMovieIds),
  );
  readonly selectedMovieIdSet = computed(() => new Set(this.selectedMovieIds()));
  readonly selectedCount = computed(() => this.selectedMovieIds().length);
  readonly canContinue = computed(() => this.selectedCount() === this.maxSelectedMovies);
  readonly continueRequirementMessage = computed(() => {
    const remainingMovies = this.maxSelectedMovies - this.selectedCount();

    if (remainingMovies <= 0) {
      return 'Voce ja selecionou os 5 filmes necessarios para continuar.';
    }

    return `Escolha mais ${remainingMovies} ${
      remainingMovies === 1 ? 'filme' : 'filmes'
    } para avancar para as recomendacoes.`;
  });
  readonly activeGenreLabel = computed(
    () =>
      this.genreOptions.find((genre) => genre.id === this.activeGenreId())?.label ??
      this.genreOptions[0].label,
  );
  readonly filteredCards = computed(() => this.movieCards());
  readonly moviePageCount = computed(() =>
    Math.max(1, Math.ceil(this.movieTotal() / this.moviePageSize())),
  );
  readonly currentMoviePageIndex = computed(() =>
    Math.min(this.moviePageIndex(), this.moviePageCount() - 1),
  );
  readonly paginatedCards = computed(() => this.filteredCards());
  readonly moviePaginationRangeLabel = computed(() => {
    const total = this.movieTotal();

    if (!total) {
      return '0 de 0';
    }

    const startIndex = this.currentMoviePageIndex() * this.moviePageSize();
    const firstItem = startIndex + 1;
    const lastItem = Math.min(startIndex + this.moviePageSize(), total);

    return `${firstItem} a ${lastItem} de ${total}`;
  });
  readonly showMoviePagination = computed(() => this.movieTotal() > 0);
  readonly selectedCards = computed(() =>
    this.selectedMovieIds()
      .map((movieId) => this.movieCache().get(movieId))
      .filter((card): card is MovieSelectionCard => Boolean(card)),
  );
  readonly hasNoResults = computed(() => !this.isLoadingMovies() && this.filteredCards().length === 0);
  readonly emptyStateMessage = computed(() => {
    if (this.apiError()) {
      return this.apiError();
    }

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

  ngOnInit(): void {
    this.loadMovies();
  }

  ngAfterViewInit(): void {
    this.scheduleGenreScrollStateUpdate();
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

    this.scheduleGenreScrollStateUpdate();
  }

  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.resetMoviePagination();
    this.showSelectionLimitHint.set(false);
    this.loadMovies();
  }

  selectGenre(genreId: GenreFilterId): void {
    this.activeGenreId.set(genreId);
    this.resetMoviePagination();
    this.showSelectionLimitHint.set(false);
    this.loadMovies();
  }

  selectGenreFromClick(genreId: GenreFilterId, event: Event): void {
    if (this.shouldSuppressGenreClick) {
      event.preventDefault();
      event.stopPropagation();
      this.shouldSuppressGenreClick = false;
      return;
    }

    this.selectGenre(genreId);
  }

  updateMovieOrdering(ordering: string): void {
    if (!this.isMovieOrdering(ordering) || ordering === this.activeMovieOrdering()) {
      return;
    }

    this.activeMovieOrdering.set(ordering);
    this.resetMoviePagination();
    this.showSelectionLimitHint.set(false);
    this.loadMovies();
  }

  updateGenreScrollState(): void {
    const scroller = this.genreScroller?.nativeElement;

    if (!scroller) {
      return;
    }

    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const currentScrollLeft = Math.max(0, Math.min(scroller.scrollLeft, maxScrollLeft));

    this.canScrollGenresLeft.set(currentScrollLeft > 1);
    this.canScrollGenresRight.set(currentScrollLeft < maxScrollLeft - 1);

    if (!this.canScrollGenresLeft() && this.genreEdgeHover() === 'start') {
      this.genreEdgeHover.set(null);
    }

    if (!this.canScrollGenresRight() && this.genreEdgeHover() === 'end') {
      this.genreEdgeHover.set(null);
    }
  }

  updateGenreEdgeHover(event: MouseEvent): void {
    if (this.isDraggingGenreScroller()) {
      return;
    }

    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const threshold = Math.min(GENRE_EDGE_HOVER_THRESHOLD, Math.max(56, bounds.width * 0.16));

    if (pointerX <= threshold && this.canScrollGenresLeft()) {
      this.genreEdgeHover.set('start');
      return;
    }

    if (bounds.width - pointerX <= threshold && this.canScrollGenresRight()) {
      this.genreEdgeHover.set('end');
      return;
    }

    this.genreEdgeHover.set(null);
  }

  clearGenreEdgeHover(): void {
    this.genreEdgeHover.set(null);
  }

  scrollGenres(direction: 'left' | 'right'): void {
    const scroller = this.genreScroller?.nativeElement;

    if (!scroller) {
      return;
    }

    const scrollDistance = Math.max(180, scroller.clientWidth * 0.55);

    scroller.scrollBy({
      left: direction === 'left' ? -scrollDistance : scrollDistance,
      behavior: 'smooth',
    });
  }

  startGenreScrollDrag(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    const scroller = this.genreScroller?.nativeElement;

    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) {
      return;
    }

    this.genreDragPointerId = event.pointerId;
    this.genreDragStartX = event.clientX;
    this.genreDragStartScrollLeft = scroller.scrollLeft;
    this.shouldSuppressGenreClick = false;
  }

  moveGenreScrollDrag(event: PointerEvent): void {
    if (this.genreDragPointerId !== event.pointerId) {
      return;
    }

    const scroller = this.genreScroller?.nativeElement;

    if (!scroller) {
      return;
    }

    const dragDistance = event.clientX - this.genreDragStartX;

    if (!this.isDraggingGenreScroller() && Math.abs(dragDistance) <= GENRE_DRAG_THRESHOLD) {
      return;
    }

    if (!this.isDraggingGenreScroller()) {
      this.shouldSuppressGenreClick = true;
      this.isDraggingGenreScroller.set(true);
      this.genreEdgeHover.set(null);

      if (!scroller.hasPointerCapture(event.pointerId)) {
        scroller.setPointerCapture(event.pointerId);
      }
    }

    scroller.scrollLeft = this.genreDragStartScrollLeft - dragDistance;
    event.preventDefault();
    this.updateGenreScrollState();
  }

  endGenreScrollDrag(event: PointerEvent): void {
    if (this.genreDragPointerId !== event.pointerId) {
      return;
    }

    const scroller = this.genreScroller?.nativeElement;

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }

    this.genreDragPointerId = null;
    this.isDraggingGenreScroller.set(false);
    this.updateGenreScrollState();

    if (this.shouldSuppressGenreClick && typeof window !== 'undefined') {
      window.setTimeout(() => {
        this.shouldSuppressGenreClick = false;
      }, 0);
    }
  }

  toggleMovieSelection(movieId: number, event?: Event): void {
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

  removeSelectedMovie(movieId: number, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.updateSelectedMovieIds(
      this.selectedMovieIds().filter((selectedId) => selectedId !== movieId),
    );
  }

  toggleMovieDetails(movieId: number, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.expandedMovieId() === movieId) {
      this.closeExpandedDetails();
      return;
    }

    const expandedRowStart = this.currentVisualMovieRowStart(movieId);
    const visualMovieOrderIds = this.nextExpandedMovieOrder(movieId, expandedRowStart);

    this.visualMovieOrderIds.set(visualMovieOrderIds);
    this.expandedMovieRowStart.set(visualMovieOrderIds.indexOf(movieId));
    this.expandedMovieId.set(movieId);
  }

  closeExpandedDetails(): void {
    this.expandedMovieId.set(null);
    this.expandedMovieRowStart.set(0);
    this.visualMovieOrderIds.set([]);
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
    this.scheduleGenreScrollStateUpdate();
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
    this.scheduleGenreScrollStateUpdate();
  }

  onCardKeydown(event: KeyboardEvent, movieId: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMovieSelection(movieId);
    }
  }

  goToPreviousStep(): void {
    void this.router.navigateByUrl('/instructions');
  }

  goToParticipantEntry(): void {
    void this.router.navigateByUrl('/participant-entry');
  }

  continueToLoading(): void {
    if (!this.canContinue()) {
      this.showContinueRequirementAlert.set(true);
      this.showSelectionLimitHint.set(false);
      return;
    }

    this.showContinueRequirementAlert.set(false);
    this.saveFavoritesAndContinue();
  }

  dismissContinueRequirementAlert(): void {
    this.showContinueRequirementAlert.set(false);
  }

  dismissSelectionLimitHint(): void {
    this.showSelectionLimitHint.set(false);
  }

  goToMoviePage(pageIndex: number): void {
    const nextPageIndex = Math.max(0, Math.min(pageIndex, this.moviePageCount() - 1));

    if (nextPageIndex === this.moviePageIndex()) {
      return;
    }

    this.moviePageIndex.set(nextPageIndex);
    this.closeExpandedDetails();
    this.loadMovies();
  }

  updateMoviePageSize(size: string): void {
    const pageSize = Number(size);

    if (!this.pageSizeOptions.includes(pageSize as (typeof PAGE_SIZE_OPTIONS)[number])) {
      return;
    }

    this.moviePageSize.set(pageSize);
    this.resetMoviePagination();
    this.loadMovies();
  }

  goToPreviousMoviePage(): void {
    this.goToMoviePage(this.moviePageIndex() - 1);
  }

  goToNextMoviePage(): void {
    this.goToMoviePage(this.moviePageIndex() + 1);
  }

  isGenreActive(genreId: GenreFilterId): boolean {
    return this.activeGenreId() === genreId;
  }

  isMovieSelected(movieId: number): boolean {
    return this.selectedMovieIdSet().has(movieId);
  }

  isSelectionBlocked(movieId: number): boolean {
    return !this.isMovieSelected(movieId) && this.selectedCount() >= this.maxSelectedMovies;
  }

  isDetailsExpanded(movieId: number): boolean {
    return this.expandedMovieId() === movieId;
  }

  movieCardOrder(movieId: number): number {
    const cards = this.paginatedCards();
    const cardIndex = cards.findIndex((card) => card.movie.id === movieId);
    const orderIndex = this.currentMovieOrderIds(cards).indexOf(movieId);

    if (orderIndex !== -1) {
      return orderIndex;
    }

    return Math.max(0, cardIndex);
  }

  private loadMovies(): void {
    this.isLoadingMovies.set(true);
    this.apiError.set('');

    this.movieApiService
      .listMovies({
        page: this.currentMoviePageIndex() + 1,
        size: this.moviePageSize(),
        titulo: this.searchQuery().trim() || undefined,
        genero: this.activeGenreId() === ALL_GENRES_ID ? undefined : this.activeGenreId(),
        ordenacao: this.activeMovieOrdering(),
      })
      .subscribe({
        next: (page) => {
          const cards = page.items.map((movie, index) =>
            createMovieSelectionCard(
              movie,
              (Math.max(page.page, 1) - 1) * Math.max(page.size, 1) + index,
            ),
          );

          this.movieCards.set(cards);
          this.movieTotal.set(page.total);
          this.movieCache.update((cache) => {
            const nextCache = new Map(cache);
            cards.forEach((card) => nextCache.set(card.movie.id, card));
            return nextCache;
          });
          this.scheduleGenreScrollStateUpdate();
        },
        error: () => {
          this.movieCards.set([]);
          this.movieTotal.set(0);
          this.apiError.set('Nao foi possivel carregar os filmes da API.');
        },
        complete: () => this.isLoadingMovies.set(false),
      });
  }

  private saveFavoritesAndContinue(): void {
    const backendUserId = this.session().backendUserId;

    if (!backendUserId) {
      this.apiError.set('Crie o participante novamente antes de salvar os filmes.');
      return;
    }

    this.recommendationApiService.saveFavoriteMovies(backendUserId, this.selectedMovieIds()).subscribe({
      next: () => void this.router.navigateByUrl('/loading'),
      error: () =>
        this.apiError.set('Nao foi possivel salvar os filmes favoritos. Tente novamente.'),
    });
  }

  private updateSelectedMovieIds(ids: number[]): void {
    const normalizedIds = normalizeSelectedMovieIds(ids);

    this.participantSessionService.setSelectedSeedMovieIds(normalizedIds);
    this.showSelectionLimitHint.set(false);

    if (normalizedIds.length === this.maxSelectedMovies) {
      this.showContinueRequirementAlert.set(false);
    }
  }

  private isMovieOrdering(ordering: string): ordering is MovieOrdering {
    return MOVIE_ORDERING_OPTIONS.some((option) => option.id === ordering);
  }

  private resetMoviePagination(): void {
    this.moviePageIndex.set(0);
    this.closeExpandedDetails();
  }

  private scheduleGenreScrollStateUpdate(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => this.updateGenreScrollState());
  }

  private currentVisualMovieRowStart(movieId: number): number {
    const cards = this.paginatedCards();
    const gridColumns = this.currentGridColumns();
    const visualSlot = this.currentMovieVisualSlots(cards, gridColumns).get(movieId);

    if (visualSlot === undefined) {
      return 0;
    }

    return Math.floor(visualSlot / gridColumns) * gridColumns;
  }

  private nextExpandedMovieOrder(movieId: number, expandedRowStart: number): number[] {
    const cards = this.paginatedCards();
    const gridColumns = this.currentGridColumns();
    const remainingMovieIds = this.currentMovieOrderIds(cards).filter((id) => id !== movieId);
    const insertionIndex = this.expandedMovieInsertionIndex(
      expandedRowStart,
      remainingMovieIds.length,
      gridColumns,
    );

    return [
      ...remainingMovieIds.slice(0, insertionIndex),
      movieId,
      ...remainingMovieIds.slice(insertionIndex),
    ];
  }

  private expandedMovieInsertionIndex(
    expandedRowStart: number,
    remainingMovieCount: number,
    gridColumns: number,
  ): number {
    const normalizedRowStart = Math.max(
      0,
      Math.floor(expandedRowStart / gridColumns) * gridColumns,
    );

    if (normalizedRowStart <= remainingMovieCount) {
      return normalizedRowStart;
    }

    return Math.max(0, Math.floor(remainingMovieCount / gridColumns) * gridColumns);
  }

  private currentMovieVisualSlots(
    cards: MovieSelectionCard[],
    gridColumns: number,
  ): Map<number, number> {
    const expandedMovieId = this.expandedMovieId();
    const visualSlots = new Map<number, number>();
    let nextSlot = 0;

    for (const movieId of this.currentMovieOrderIds(cards)) {
      if (movieId === expandedMovieId) {
        const remainder = nextSlot % gridColumns;

        if (remainder > 0) {
          nextSlot += gridColumns - remainder;
        }

        visualSlots.set(movieId, nextSlot);
        nextSlot += gridColumns;
        continue;
      }

      visualSlots.set(movieId, nextSlot);
      nextSlot += 1;
    }

    return visualSlots;
  }

  private currentMovieOrderIds(cards: MovieSelectionCard[]): number[] {
    const pageMovieIds = cards.map((card) => card.movie.id);
    const expandedMovieId = this.expandedMovieId();
    const visualMovieOrderIds = this.visualMovieOrderIds();

    if (!expandedMovieId || visualMovieOrderIds.length !== pageMovieIds.length) {
      return pageMovieIds;
    }

    const pageMovieIdSet = new Set(pageMovieIds);

    if (!visualMovieOrderIds.every((movieId) => pageMovieIdSet.has(movieId))) {
      return pageMovieIds;
    }

    return visualMovieOrderIds;
  }

  private currentGridColumns(): number {
    const width = this.viewportWidth();

    if (width <= 720) {
      return 1;
    }

    if (width <= 1080) {
      return 2;
    }

    if (this.isDrawerOpen() && width <= 1180) {
      return 2;
    }

    if (this.isDrawerOpen() && width <= 1280) {
      return 3;
    }

    if (this.isDrawerOpen()) {
      return 4;
    }

    if (width <= 1180) {
      return 4;
    }

    return 5;
  }
}
