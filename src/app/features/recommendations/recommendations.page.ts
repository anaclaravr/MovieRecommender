import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import {
  PersuasiveStimulusType,
  SelectedStimulusSummary,
  createEmptySelectedStimulusSummary,
} from '../../core/models/experience-tracking';
import { Movie } from '../../core/models/movie';
import { ExperienceTrackingService } from '../../core/services/experience-tracking.service';
import { ParticipantSessionService } from '../../core/services/participant-session.service';

interface RecommendationCard {
  movie: Movie;
  posterGradient: string;
  posterImage: string;
  genresLabel: string;
  durationLabel: string;
  ratingLabel: string;
  director: string;
  rank: number;
  rankLabel: string;
  mediatedCue: string;
  ratingBadgeLabel: string;
}

const RECOMMENDATION_LIMIT = 10;
const RECOMMENDATIONS_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;
const POSTER_GRADIENTS = [
  'linear-gradient(160deg, #183149 0%, #446c8d 48%, #9ec3de 100%)',
  'linear-gradient(160deg, #f0e8df 0%, #d4c6b1 48%, #8d6d4f 100%)',
  'linear-gradient(160deg, #0f1d33 0%, #204b74 44%, #ff7d32 100%)',
  'linear-gradient(160deg, #17193f 0%, #5339ac 48%, #9ea7f0 100%)',
  'linear-gradient(160deg, #451a1d 0%, #b53b2f 48%, #f1a13a 100%)',
  'linear-gradient(160deg, #b5c1cb 0%, #edf2f5 48%, #7f8f99 100%)',
  'linear-gradient(160deg, #14344f 0%, #325b78 46%, #d2dfeb 100%)',
  'linear-gradient(160deg, #5b1016 0%, #a82b1e 44%, #f3c14e 100%)',
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
const TOP_RECOMMENDATION_CUES = [
  'Melhor correspondência para você',
  'Muito próximo do seu perfil',
  'Boa chance de agradar',
] as const;
const TOP_RATED_BADGE_LABEL = 'Mais bem avaliado';
const MOVIE_DETAILS: Record<
  string,
  { durationLabel: string; ratingLabel: string; director: string }
> = {
  arrival: {
    durationLabel: '1h 56min',
    ratingLabel: '7.9',
    director: 'Denis Villeneuve',
  },
  'before-sunrise': {
    durationLabel: '1h 41min',
    ratingLabel: '8.1',
    director: 'Richard Linklater',
  },
  'blade-runner-2049': {
    durationLabel: '2h 44min',
    ratingLabel: '8.0',
    director: 'Denis Villeneuve',
  },
  coco: {
    durationLabel: '1h 45min',
    ratingLabel: '8.4',
    director: 'Lee Unkrich',
  },
  'dune-part-one': {
    durationLabel: '2h 35min',
    ratingLabel: '8.0',
    director: 'Denis Villeneuve',
  },
  'get-out': {
    durationLabel: '1h 44min',
    ratingLabel: '7.8',
    director: 'Jordan Peele',
  },
  interstellar: {
    durationLabel: '2h 49min',
    ratingLabel: '8.7',
    director: 'Christopher Nolan',
  },
  'lady-bird': {
    durationLabel: '1h 34min',
    ratingLabel: '7.4',
    director: 'Greta Gerwig',
  },
  'little-miss-sunshine': {
    durationLabel: '1h 41min',
    ratingLabel: '7.8',
    director: 'Jonathan Dayton e Valerie Faris',
  },
  'mad-max-fury-road': {
    durationLabel: '2h',
    ratingLabel: '8.1',
    director: 'George Miller',
  },
  parasite: {
    durationLabel: '2h 12min',
    ratingLabel: '8.5',
    director: 'Bong Joon Ho',
  },
  'spider-verse': {
    durationLabel: '1h 57min',
    ratingLabel: '8.4',
    director: 'Bob Persichetti, Peter Ramsey e Rodney Rothman',
  },
};
const FALLBACK_MOVIE_DETAILS = {
  durationLabel: '2h',
  ratingLabel: '8.0',
  director: 'Direção não informada',
} as const;

function getGenreLabel(genre: string): string {
  return GENRE_LABELS[genre] ?? genre;
}

function createRecommendationCard(movie: Movie, index: number): RecommendationCard {
  const rank = index + 1;
  const details = MOVIE_DETAILS[movie.id] ?? FALLBACK_MOVIE_DETAILS;

  return {
    movie,
    posterGradient: POSTER_GRADIENTS[index % POSTER_GRADIENTS.length],
    posterImage: `url("${movie.posterUrl}")`,
    genresLabel: movie.genres.map((genre) => getGenreLabel(genre)).join(' • '),
    durationLabel: details.durationLabel,
    ratingLabel: details.ratingLabel,
    director: details.director,
    rank,
    rankLabel: rank <= 3 ? `#${rank}` : '',
    mediatedCue: TOP_RECOMMENDATION_CUES[index] ?? '',
    ratingBadgeLabel: '',
  };
}

function getRatingValue(card: RecommendationCard): number {
  return Number.parseFloat(card.ratingLabel.replace(',', '.'));
}

function addRecommendationBadges(cards: RecommendationCard[]): RecommendationCard[] {
  const highestRatedCard = cards
    .slice()
    .sort((left, right) => getRatingValue(right) - getRatingValue(left))[0];

  return cards.map((card) => ({
    ...card,
    ratingBadgeLabel:
      highestRatedCard && card.movie.id === highestRatedCard.movie.id ? TOP_RATED_BADGE_LABEL : '',
  }));
}

@Component({
  selector: 'app-recommendations-page',
  templateUrl: './recommendations.page.html',
  styleUrl: './recommendations.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationsPage implements OnInit {
  private readonly participantSessionService = inject(ParticipantSessionService);
  private readonly experienceTrackingService = inject(ExperienceTrackingService);
  private readonly router = inject(Router);

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly session = this.participantSessionService.session;
  readonly expandedMovieId = signal<string | null>(null);
  readonly wouldWatchMovieIds = signal<Set<string>>(new Set());
  readonly recommendationPageIndex = signal(0);
  readonly recommendationsPageSize = signal(RECOMMENDATIONS_PAGE_SIZE);
  readonly selectedSeedMovieIds = computed(() => this.session().selectedSeedMovieIds.slice(0, 5));
  readonly selectedSeedMovieIdSet = computed(() => new Set(this.selectedSeedMovieIds()));
  readonly seedCards = computed(() =>
    this.selectedSeedMovieIds()
      .map((movieId) => MOCK_MOVIES.find((movie) => movie.id === movieId))
      .filter((movie): movie is Movie => Boolean(movie))
      .map((movie, index) => createRecommendationCard(movie, index)),
  );
  readonly recommendationCards = computed(() => {
    const selectedMovieIds = this.selectedSeedMovieIdSet();
    const nonSelectedMovies = MOCK_MOVIES.filter((movie) => !selectedMovieIds.has(movie.id));
    const fallbackMovies = MOCK_MOVIES.filter((movie) => selectedMovieIds.has(movie.id));

    const cards = [...nonSelectedMovies, ...fallbackMovies]
      .slice(0, RECOMMENDATION_LIMIT)
      .map((movie, index) => createRecommendationCard(movie, index));

    return addRecommendationBadges(cards);
  });
  readonly recommendationPageCount = computed(() =>
    Math.max(1, Math.ceil(this.recommendationCards().length / this.recommendationsPageSize())),
  );
  readonly currentRecommendationPageIndex = computed(() =>
    Math.min(this.recommendationPageIndex(), this.recommendationPageCount() - 1),
  );
  readonly paginatedRecommendationCards = computed(() => {
    const startIndex = this.currentRecommendationPageIndex() * this.recommendationsPageSize();

    return this.recommendationCards().slice(
      startIndex,
      startIndex + this.recommendationsPageSize(),
    );
  });
  readonly recommendationPaginationRangeLabel = computed(() => {
    const total = this.recommendationCards().length;

    if (!total) {
      return '0 de 0';
    }

    const startIndex = this.currentRecommendationPageIndex() * this.recommendationsPageSize();
    const firstItem = startIndex + 1;
    const lastItem = Math.min(startIndex + this.recommendationsPageSize(), total);

    return `${firstItem} a ${lastItem} de ${total}`;
  });
  readonly showRecommendationsPagination = computed(() => this.recommendationCards().length > 0);
  readonly detailsCard = computed(() => {
    const expandedMovieId = this.expandedMovieId();

    return this.recommendationCards().find((card) => card.movie.id === expandedMovieId) ?? null;
  });
  readonly wouldWatchCount = computed(() => this.wouldWatchMovieIds().size);

  ngOnInit(): void {
    this.experienceTrackingService.trackExperienceStarted(this.trackingContext());
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeDetails();
  }

  openDetails(movieId: string): void {
    if (this.expandedMovieId() === movieId) {
      return;
    }

    this.expandedMovieId.set(movieId);
    this.experienceTrackingService.trackResourceUsed(this.trackingContext(), 'details_opened');
  }

  openDetailsFromCard(movieId: string, event: Event): void {
    if (this.isInteractiveEventTarget(event)) {
      return;
    }

    this.openDetails(movieId);
  }

  onRecommendationCardKeydown(event: KeyboardEvent, movieId: string): void {
    if (this.isInteractiveEventTarget(event) || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    this.openDetails(movieId);
  }

  updateRecommendationTooltipPosition(event: PointerEvent): void {
    const card = event.currentTarget;

    if (!(card instanceof HTMLElement)) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const tooltipHalfWidth = 58;
    const tooltipHeightWithGap = 42;
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const tooltipX = Math.max(
      tooltipHalfWidth,
      Math.min(pointerX, bounds.width - tooltipHalfWidth),
    );
    const tooltipY = Math.max(tooltipHeightWithGap, pointerY);

    card.style.setProperty('--tooltip-x', `${tooltipX}px`);
    card.style.setProperty('--tooltip-y', `${tooltipY}px`);
  }

  closeDetails(): void {
    this.expandedMovieId.set(null);
  }

  goToPreviousStep(): void {
    void this.router.navigateByUrl('/movie-selection');
  }

  goToParticipantEntry(): void {
    void this.router.navigateByUrl('/participant-entry');
  }

  finishRecommendations(): void {
    const selectedMovieIds = Array.from(this.wouldWatchMovieIds());

    this.experienceTrackingService.trackExperienceCompleted(this.trackingContext(), {
      selectedMovieIds,
      selectedStimulusSummary: this.selectedStimulusSummary(selectedMovieIds),
    });
    this.closeDetails();
    void this.router.navigateByUrl('/choice-feedback');
  }

  goToRecommendationPage(pageIndex: number): void {
    const nextPageIndex = Math.max(0, Math.min(pageIndex, this.recommendationPageCount() - 1));

    if (nextPageIndex === this.recommendationPageIndex()) {
      return;
    }

    this.recommendationPageIndex.set(nextPageIndex);
    this.closeDetails();
  }

  updateRecommendationPageSize(size: string): void {
    const pageSize = Number(size);

    if (!this.pageSizeOptions.includes(pageSize as (typeof PAGE_SIZE_OPTIONS)[number])) {
      return;
    }

    this.recommendationsPageSize.set(pageSize);
    this.recommendationPageIndex.set(0);
    this.closeDetails();
  }

  goToPreviousRecommendationPage(): void {
    this.goToRecommendationPage(this.recommendationPageIndex() - 1);
  }

  goToNextRecommendationPage(): void {
    this.goToRecommendationPage(this.recommendationPageIndex() + 1);
  }

  toggleWouldWatch(movieId: string, event?: Event): void {
    event?.stopPropagation();

    if (!this.wouldWatchMovieIds().has(movieId)) {
      this.trackMovieSelected(movieId);
    }

    this.wouldWatchMovieIds.update((movieIds) => this.toggleMovieId(movieIds, movieId));
  }

  isDetailsExpanded(movieId: string): boolean {
    return this.expandedMovieId() === movieId;
  }

  isMarkedWouldWatch(movieId: string): boolean {
    return this.wouldWatchMovieIds().has(movieId);
  }

  isTopRecommendation(card: RecommendationCard): boolean {
    return card.rank <= 3;
  }

  isPrimaryRecommendation(card: RecommendationCard): boolean {
    return card.rank === 1;
  }

  private toggleMovieId(movieIds: Set<string>, movieId: string): Set<string> {
    const nextMovieIds = new Set(movieIds);

    if (nextMovieIds.has(movieId)) {
      nextMovieIds.delete(movieId);
    } else {
      nextMovieIds.add(movieId);
    }

    return nextMovieIds;
  }

  private trackMovieSelected(movieId: string): void {
    const card = this.recommendationCards().find(
      (recommendationCard) => recommendationCard.movie.id === movieId,
    );

    if (!card) {
      return;
    }

    this.experienceTrackingService.trackMovieSelected(this.trackingContext(), {
      movieId: card.movie.id,
      movieTitle: card.movie.title,
      persuasiveStimulusType: this.persuasiveStimulusTypeForCard(card),
    });
  }

  private selectedStimulusSummary(selectedMovieIds: string[]): SelectedStimulusSummary {
    const summary = createEmptySelectedStimulusSummary();

    for (const movieId of selectedMovieIds) {
      const stimulusType = this.persuasiveStimulusTypeForMovie(movieId);

      summary[stimulusType] += 1;
    }

    return summary;
  }

  private persuasiveStimulusTypeForMovie(movieId: string): PersuasiveStimulusType {
    const card = this.recommendationCards().find(
      (recommendationCard) => recommendationCard.movie.id === movieId,
    );

    return card ? this.persuasiveStimulusTypeForCard(card) : 'none';
  }

  private persuasiveStimulusTypeForCard(card: RecommendationCard): PersuasiveStimulusType {
    if (card.rank === 1) {
      return 'top_1';
    }

    if (card.rank === 2) {
      return 'top_2';
    }

    if (card.rank === 3) {
      return 'top_3';
    }

    if (card.ratingBadgeLabel) {
      return 'best_rated';
    }

    return 'recommended_for_you';
  }

  private trackingContext() {
    return this.experienceTrackingService.createContext(this.session());
  }

  private isInteractiveEventTarget(event: Event): boolean {
    return event.target instanceof Element && Boolean(event.target.closest('button, a, input'));
  }
}
