import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import {
  SelectedStimulusSummary,
  createEmptySelectedStimulusSummary,
} from '../../core/models/experience-tracking';
import { Movie } from '../../core/models/movie';
import { ExperienceTrackingService } from '../../core/services/experience-tracking.service';
import { ParticipantSessionService } from '../../core/services/participant-session.service';

type GenreFilterId = 'all' | string;
type DetailsContrast = 'dark';

interface GenreFilterOption {
  id: GenreFilterId;
  label: string;
  iconClass: string;
}

interface NeutralMovieCard {
  movie: Movie;
  posterGradient: string;
  posterImage: string;
  detailsContrast: DetailsContrast;
  genresLabel: string;
  durationLabel: string;
  ratingLabel: string;
}

const MOVIE_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;
const ALL_GENRES_ID: GenreFilterId = 'all';
const SEARCH_TRACKING_DEBOUNCE_MS = 600;
const MIN_SEARCH_TRACKING_LENGTH = 2;
const GENRE_EDGE_HOVER_THRESHOLD = 96;
const GENRE_DRAG_THRESHOLD = 6;
const POSTER_GRADIENTS = [
  'linear-gradient(160deg, #dfe7ed 0%, #aab8c2 100%)',
  'linear-gradient(160deg, #ece7df 0%, #c8bba9 100%)',
  'linear-gradient(160deg, #dde3e8 0%, #9caab4 100%)',
  'linear-gradient(160deg, #e8e1e8 0%, #b8a9bd 100%)',
  'linear-gradient(160deg, #e9e2dc 0%, #bca996 100%)',
  'linear-gradient(160deg, #dce6e8 0%, #9fb4ba 100%)',
  'linear-gradient(160deg, #e4e8ea 0%, #b6bec4 100%)',
  'linear-gradient(160deg, #dfe8e2 0%, #a8b9ad 100%)',
] as const;
const GENRE_LABELS: Record<string, string> = {
  Action: 'Ação',
  Adventure: 'Aventura',
  Animation: 'Animação',
  Comedy: 'Comédia',
  Drama: 'Drama',
  Family: 'Família',
  Horror: 'Terror',
  Mystery: 'Mistério',
  Romance: 'Romance',
  'Science Fiction': 'Ficção científica',
  Thriller: 'Thriller',
};
const GENRE_ICON_CLASSES: Record<string, string> = {
  [ALL_GENRES_ID]: 'pi pi-list',
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
  Thriller: 'pi pi-camera',
};
const MOVIE_DETAILS: Record<string, { durationLabel: string; ratingLabel: string }> = {
  arrival: {
    durationLabel: '1h 56min',
    ratingLabel: '7.9',
  },
  'before-sunrise': {
    durationLabel: '1h 41min',
    ratingLabel: '8.1',
  },
  'blade-runner-2049': {
    durationLabel: '2h 44min',
    ratingLabel: '8.0',
  },
  coco: {
    durationLabel: '1h 45min',
    ratingLabel: '8.4',
  },
  'dune-part-one': {
    durationLabel: '2h 35min',
    ratingLabel: '8.0',
  },
  'get-out': {
    durationLabel: '1h 44min',
    ratingLabel: '7.8',
  },
  interstellar: {
    durationLabel: '2h 49min',
    ratingLabel: '8.7',
  },
  'lady-bird': {
    durationLabel: '1h 34min',
    ratingLabel: '7.4',
  },
  'little-miss-sunshine': {
    durationLabel: '1h 41min',
    ratingLabel: '7.8',
  },
  'mad-max-fury-road': {
    durationLabel: '2h',
    ratingLabel: '8.1',
  },
  parasite: {
    durationLabel: '2h 12min',
    ratingLabel: '8.5',
  },
  'spider-verse': {
    durationLabel: '1h 57min',
    ratingLabel: '8.4',
  },
};
const FALLBACK_MOVIE_DETAILS = {
  durationLabel: '2h',
  ratingLabel: '8.0',
} as const;

function getGenreLabel(genre: string): string {
  return GENRE_LABELS[genre] ?? genre;
}

function getGenreIconClass(genre: GenreFilterId): string {
  return GENRE_ICON_CLASSES[genre] ?? 'pi pi-tag';
}

function createNeutralMovieCard(movie: Movie, index: number): NeutralMovieCard {
  const details = MOVIE_DETAILS[movie.id] ?? FALLBACK_MOVIE_DETAILS;

  return {
    movie,
    posterGradient: POSTER_GRADIENTS[index % POSTER_GRADIENTS.length],
    posterImage: `url("${movie.posterUrl}")`,
    detailsContrast: 'dark',
    genresLabel: movie.genres.map((genre) => getGenreLabel(genre)).join(' • '),
    durationLabel: details.durationLabel,
    ratingLabel: details.ratingLabel,
  };
}

const NEUTRAL_MOVIE_CARDS = MOCK_MOVIES.map((movie, index) => createNeutralMovieCard(movie, index));
const MOVIE_CARD_BY_ID = new Map(NEUTRAL_MOVIE_CARDS.map((card) => [card.movie.id, card]));
const GENRE_OPTIONS: GenreFilterOption[] = [
  { id: ALL_GENRES_ID, label: 'Todos', iconClass: getGenreIconClass(ALL_GENRES_ID) },
  ...Array.from(new Set(MOCK_MOVIES.flatMap((movie) => movie.genres)))
    .sort((left, right) => getGenreLabel(left).localeCompare(getGenreLabel(right)))
    .map((genre) => ({
      id: genre,
      label: getGenreLabel(genre),
      iconClass: getGenreIconClass(genre),
    })),
];

function normalizeSelectedMovieIds(ids: string[]): string[] {
  return Array.from(new Set(ids)).filter((id) => MOVIE_CARD_BY_ID.has(id));
}

function hasSameIds(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

@Component({
  selector: 'app-neutral-experience-page',
  templateUrl: './neutral-experience.page.html',
  styleUrl: './neutral-experience.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NeutralExperiencePage implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('genreScroller') private genreScroller?: ElementRef<HTMLDivElement>;

  private readonly router = inject(Router);
  private readonly participantSessionService = inject(ParticipantSessionService);
  private readonly experienceTrackingService = inject(ExperienceTrackingService);
  private genreDragPointerId: number | null = null;
  private genreDragStartX = 0;
  private genreDragStartScrollLeft = 0;
  private shouldSuppressGenreClick = false;
  private searchTrackingTimer: ReturnType<typeof setTimeout> | null = null;
  private lastTrackedSearchQuery = '';

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly genreOptions = GENRE_OPTIONS;
  readonly session = this.participantSessionService.session;
  readonly searchQuery = signal('');
  readonly activeGenreId = signal<GenreFilterId>(ALL_GENRES_ID);
  readonly isDrawerOpen = signal(false);
  readonly expandedMovieId = signal<string | null>(null);
  readonly expandedMovieRowStart = signal(0);
  readonly visualMovieOrderIds = signal<string[]>([]);
  readonly moviePageIndex = signal(0);
  readonly moviePageSize = signal(MOVIE_PAGE_SIZE);
  readonly viewportWidth = signal(typeof window === 'undefined' ? 1440 : window.innerWidth);
  readonly canScrollGenresLeft = signal(false);
  readonly canScrollGenresRight = signal(false);
  readonly isDraggingGenreScroller = signal(false);
  readonly genreEdgeHover = signal<'start' | 'end' | null>(null);

  readonly selectedMovieIds = computed(() =>
    normalizeSelectedMovieIds(this.session().selectedNeutralMovieIds),
  );
  readonly selectedMovieIdSet = computed(() => new Set(this.selectedMovieIds()));
  readonly selectedCount = computed(() => this.selectedMovieIds().length);
  readonly activeGenreLabel = computed(
    () =>
      this.genreOptions.find((genre) => genre.id === this.activeGenreId())?.label ??
      this.genreOptions[0].label,
  );
  readonly filteredCards = computed(() => {
    const normalizedSearch = this.searchQuery().trim().toLowerCase();
    const activeGenreId = this.activeGenreId();

    return NEUTRAL_MOVIE_CARDS.filter((card) => {
      const matchesSearch = normalizedSearch
        ? card.movie.title.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesGenre =
        activeGenreId === ALL_GENRES_ID ? true : card.movie.genres.includes(activeGenreId);

      return matchesSearch && matchesGenre;
    });
  });
  readonly moviePageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredCards().length / this.moviePageSize())),
  );
  readonly currentMoviePageIndex = computed(() =>
    Math.min(this.moviePageIndex(), this.moviePageCount() - 1),
  );
  readonly paginatedCards = computed(() => {
    const startIndex = this.currentMoviePageIndex() * this.moviePageSize();

    return this.filteredCards().slice(startIndex, startIndex + this.moviePageSize());
  });
  readonly moviePaginationRangeLabel = computed(() => {
    const total = this.filteredCards().length;

    if (!total) {
      return '0 de 0';
    }

    const startIndex = this.currentMoviePageIndex() * this.moviePageSize();
    const firstItem = startIndex + 1;
    const lastItem = Math.min(startIndex + this.moviePageSize(), total);

    return `${firstItem} a ${lastItem} de ${total}`;
  });
  readonly showMoviePagination = computed(() => this.filteredCards().length > 0);
  readonly selectedCards = computed(() =>
    this.selectedMovieIds()
      .map((movieId) => MOVIE_CARD_BY_ID.get(movieId))
      .filter((card): card is NeutralMovieCard => Boolean(card)),
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

    return 'Nenhum filme disponível no momento.';
  });

  constructor() {
    const normalizedIds = normalizeSelectedMovieIds(this.session().selectedNeutralMovieIds);

    if (!hasSameIds(normalizedIds, this.session().selectedNeutralMovieIds)) {
      this.participantSessionService.setSelectedNeutralMovieIds(normalizedIds);
    }
  }

  ngOnInit(): void {
    this.experienceTrackingService.trackExperienceStarted(this.trackingContext());
  }

  ngAfterViewInit(): void {
    this.scheduleGenreScrollStateUpdate();
  }

  ngOnDestroy(): void {
    this.clearSearchTrackingTimer();
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
    this.scheduleSearchTracking(query);
  }

  selectGenre(genreId: GenreFilterId): void {
    const previousGenreId = this.activeGenreId();

    this.activeGenreId.set(genreId);
    this.resetMoviePagination();

    if (genreId !== previousGenreId) {
      this.experienceTrackingService.trackResourceUsed(this.trackingContext(), 'genre_filter');
    }
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

  toggleWouldWatch(movieId: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    const selectedMovieIds = this.selectedMovieIds();
    const isSelectingMovie = !selectedMovieIds.includes(movieId);

    if (isSelectingMovie) {
      this.flushPendingSearchTracking();
      this.trackMovieSelected(movieId);
    }

    const nextMovieIds = selectedMovieIds.includes(movieId)
      ? selectedMovieIds.filter((selectedId) => selectedId !== movieId)
      : [...selectedMovieIds, movieId];

    this.participantSessionService.setSelectedNeutralMovieIds(
      normalizeSelectedMovieIds(nextMovieIds),
    );
  }

  removeSelectedMovie(movieId: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.participantSessionService.setSelectedNeutralMovieIds(
      this.selectedMovieIds().filter((selectedId) => selectedId !== movieId),
    );
  }

  toggleMovieDetails(movieId: string, event?: Event): void {
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
    this.experienceTrackingService.trackResourceUsed(this.trackingContext(), 'details_opened');
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

  onCardKeydown(event: KeyboardEvent, movieId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleWouldWatch(movieId);
    }
  }

  goToInstructions(): void {
    void this.router.navigateByUrl('/instructions');
  }

  goToParticipantEntry(): void {
    void this.router.navigateByUrl('/participant-entry');
  }

  finishExperience(): void {
    const selectedMovieIds = this.selectedMovieIds();

    this.flushPendingSearchTracking();
    this.experienceTrackingService.trackExperienceCompleted(this.trackingContext(), {
      selectedMovieIds,
      selectedStimulusSummary: this.selectedStimulusSummary(selectedMovieIds),
    });
    void this.router.navigateByUrl('/choice-feedback');
  }

  goToMoviePage(pageIndex: number): void {
    const nextPageIndex = Math.max(0, Math.min(pageIndex, this.moviePageCount() - 1));

    if (nextPageIndex === this.moviePageIndex()) {
      return;
    }

    this.moviePageIndex.set(nextPageIndex);
    this.closeExpandedDetails();
  }

  updateMoviePageSize(size: string): void {
    const pageSize = Number(size);

    if (!this.pageSizeOptions.includes(pageSize as (typeof PAGE_SIZE_OPTIONS)[number])) {
      return;
    }

    this.moviePageSize.set(pageSize);
    this.resetMoviePagination();
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

  isMovieSelected(movieId: string): boolean {
    return this.selectedMovieIdSet().has(movieId);
  }

  isDetailsExpanded(movieId: string): boolean {
    return this.expandedMovieId() === movieId;
  }

  movieCardOrder(movieId: string): number {
    const cards = this.paginatedCards();
    const cardIndex = cards.findIndex((card) => card.movie.id === movieId);
    const orderIndex = this.currentMovieOrderIds(cards).indexOf(movieId);

    if (orderIndex !== -1) {
      return orderIndex;
    }

    return Math.max(0, cardIndex);
  }

  private resetMoviePagination(): void {
    this.moviePageIndex.set(0);
    this.closeExpandedDetails();
  }

  private scheduleSearchTracking(query: string): void {
    this.clearSearchTrackingTimer();

    const normalizedQuery = this.normalizedSearchQuery(query);

    if (!this.shouldTrackSearchQuery(normalizedQuery)) {
      return;
    }

    this.searchTrackingTimer = setTimeout(() => {
      this.searchTrackingTimer = null;
      this.trackSearchQuery(normalizedQuery);
    }, SEARCH_TRACKING_DEBOUNCE_MS);
  }

  private flushPendingSearchTracking(): void {
    if (!this.searchTrackingTimer) {
      return;
    }

    this.clearSearchTrackingTimer();
    this.trackSearchQuery(this.normalizedSearchQuery(this.searchQuery()));
  }

  private clearSearchTrackingTimer(): void {
    if (!this.searchTrackingTimer) {
      return;
    }

    clearTimeout(this.searchTrackingTimer);
    this.searchTrackingTimer = null;
  }

  private trackSearchQuery(normalizedQuery: string): void {
    if (!this.shouldTrackSearchQuery(normalizedQuery)) {
      return;
    }

    this.experienceTrackingService.trackResourceUsed(this.trackingContext(), 'search');
    this.lastTrackedSearchQuery = normalizedQuery;
  }

  private normalizedSearchQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  private shouldTrackSearchQuery(normalizedQuery: string): boolean {
    return (
      normalizedQuery.length >= MIN_SEARCH_TRACKING_LENGTH &&
      normalizedQuery !== this.lastTrackedSearchQuery
    );
  }

  private trackMovieSelected(movieId: string): void {
    const card = MOVIE_CARD_BY_ID.get(movieId);

    if (!card) {
      return;
    }

    this.experienceTrackingService.trackMovieSelected(this.trackingContext(), {
      movieId: card.movie.id,
      movieTitle: card.movie.title,
      persuasiveStimulusType: 'none',
    });
  }

  private selectedStimulusSummary(selectedMovieIds: string[]): SelectedStimulusSummary {
    const summary = createEmptySelectedStimulusSummary();

    summary.none = selectedMovieIds.length;

    return summary;
  }

  private trackingContext() {
    return this.experienceTrackingService.createContext(this.session());
  }

  private scheduleGenreScrollStateUpdate(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => this.updateGenreScrollState());
  }

  private currentVisualMovieRowStart(movieId: string): number {
    const cards = this.paginatedCards();
    const gridColumns = this.currentGridColumns();
    const visualSlot = this.currentMovieVisualSlots(cards, gridColumns).get(movieId);

    if (visualSlot === undefined) {
      return 0;
    }

    return Math.floor(visualSlot / gridColumns) * gridColumns;
  }

  private nextExpandedMovieOrder(movieId: string, expandedRowStart: number): string[] {
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
    cards: NeutralMovieCard[],
    gridColumns: number,
  ): Map<string, number> {
    const expandedMovieId = this.expandedMovieId();
    const visualSlots = new Map<string, number>();
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

  private currentMovieOrderIds(cards: NeutralMovieCard[]): string[] {
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
