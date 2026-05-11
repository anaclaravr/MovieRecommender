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
import { forkJoin } from 'rxjs';

import { RecommendationApiService } from '../../core/api/recommendation-api.service';
import { MovieApiService } from '../../core/api/movie-api.service';
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
const TOP_RECOMMENDATION_CUES = [
  'Melhor correspondencia para voce',
  'Muito proximo do seu perfil',
  'Boa chance de agradar',
] as const;
const TOP_RATED_BADGE_LABEL = 'Mais bem avaliado';
const FALLBACK_DIRECTOR = 'Direcao nao informada';

function getGenreLabel(genre: string): string {
  return GENRE_LABELS[genre] ?? genre;
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

function createRecommendationCard(movie: Movie, index: number, rankOverride?: number): RecommendationCard {
  const rank = rankOverride ?? index + 1;

  return {
    movie,
    posterGradient: POSTER_GRADIENTS[index % POSTER_GRADIENTS.length],
    posterImage: `url("${movie.posterUrl ?? posterPlaceholder(movie.title)}")`,
    genresLabel: movie.genres.map((genre) => getGenreLabel(genre)).join(' • '),
    durationLabel: formatRuntime(movie.runtime),
    ratingLabel: formatRating(movie.averageRating),
    director: FALLBACK_DIRECTOR,
    rank,
    rankLabel: rank <= 3 ? `#${rank}` : '',
    mediatedCue: TOP_RECOMMENDATION_CUES[rank - 1] ?? '',
    ratingBadgeLabel: '',
  };
}

function getRatingValue(card: RecommendationCard): number {
  const parsed = Number.parseFloat(card.ratingLabel.replace(',', '.'));

  return Number.isFinite(parsed) ? parsed : -1;
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
  private readonly recommendationApiService = inject(RecommendationApiService);
  private readonly movieApiService = inject(MovieApiService);
  private readonly router = inject(Router);

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly session = this.participantSessionService.session;
  readonly expandedMovieId = signal<number | null>(null);
  readonly wouldWatchMovieIds = signal<Set<number>>(new Set());
  readonly recommendationPageIndex = signal(0);
  readonly recommendationsPageSize = signal(RECOMMENDATIONS_PAGE_SIZE);
  readonly seedMovieCards = signal<RecommendationCard[]>([]);
  readonly loadedRecommendationCards = signal<RecommendationCard[]>([]);
  readonly apiError = signal('');
  readonly selectedSeedMovieIds = computed(() => this.session().selectedSeedMovieIds.slice(0, 5));
  readonly seedCards = computed(() => this.seedMovieCards());
  readonly recommendationCards = computed(() => this.loadedRecommendationCards());
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
    this.loadSeedMovies();
    this.loadRecommendations();
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeDetails();
  }

  openDetails(movieId: number): void {
    if (this.expandedMovieId() === movieId) {
      return;
    }

    this.expandedMovieId.set(movieId);
    this.experienceTrackingService.trackResourceUsed(this.trackingContext(), 'details_opened');
  }

  openDetailsFromCard(movieId: number, event: Event): void {
    if (this.isInteractiveEventTarget(event)) {
      return;
    }

    this.openDetails(movieId);
  }

  onRecommendationCardKeydown(event: KeyboardEvent, movieId: number): void {
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
      selectedMovieIds: selectedMovieIds.map(String),
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

  toggleWouldWatch(movieId: number, event?: Event): void {
    event?.stopPropagation();

    if (!this.wouldWatchMovieIds().has(movieId)) {
      this.trackMovieSelected(movieId);
    }

    this.wouldWatchMovieIds.update((movieIds) => this.toggleMovieId(movieIds, movieId));
  }

  isDetailsExpanded(movieId: number): boolean {
    return this.expandedMovieId() === movieId;
  }

  isMarkedWouldWatch(movieId: number): boolean {
    return this.wouldWatchMovieIds().has(movieId);
  }

  isTopRecommendation(card: RecommendationCard): boolean {
    return card.rank <= 3;
  }

  isPrimaryRecommendation(card: RecommendationCard): boolean {
    return card.rank === 1;
  }

  private loadSeedMovies(): void {
    const selectedMovieIds = this.selectedSeedMovieIds();

    if (!selectedMovieIds.length) {
      this.seedMovieCards.set([]);
      return;
    }

    forkJoin(selectedMovieIds.map((movieId) => this.movieApiService.getMovie(movieId))).subscribe({
      next: (movies) => {
        this.seedMovieCards.set(movies.map((movie, index) => createRecommendationCard(movie, index)));
      },
      error: () => this.seedMovieCards.set([]),
    });
  }

  private loadRecommendations(): void {
    const backendUserId = this.session().backendUserId;

    if (!backendUserId) {
      this.apiError.set('Participante sem ID do backend. Volte para a entrada e crie o participante.');
      return;
    }

    this.recommendationApiService.listJoinedRecommendations(backendUserId).subscribe({
      next: (recommendations) => {
        this.loadedRecommendationCards.set(
          addRecommendationBadges(
            recommendations.map((recommendation, index) =>
              createRecommendationCard(
                recommendation.movie,
                index,
                recommendation.rankPosition,
              ),
            ),
          ),
        );
      },
      error: () => {
        this.loadedRecommendationCards.set([]);
        this.apiError.set('Nao foi possivel carregar as recomendacoes da API.');
      },
    });
  }

  private toggleMovieId(movieIds: Set<number>, movieId: number): Set<number> {
    const nextMovieIds = new Set(movieIds);

    if (nextMovieIds.has(movieId)) {
      nextMovieIds.delete(movieId);
    } else {
      nextMovieIds.add(movieId);
    }

    return nextMovieIds;
  }

  private trackMovieSelected(movieId: number): void {
    const card = this.recommendationCards().find(
      (recommendationCard) => recommendationCard.movie.id === movieId,
    );

    if (!card) {
      return;
    }

    this.experienceTrackingService.trackMovieSelected(this.trackingContext(), {
      movieId: card.movie.id.toString(),
      movieTitle: card.movie.title,
      persuasiveStimulusType: this.persuasiveStimulusTypeForCard(card),
    });
  }

  private selectedStimulusSummary(selectedMovieIds: number[]): SelectedStimulusSummary {
    const summary = createEmptySelectedStimulusSummary();

    for (const movieId of selectedMovieIds) {
      const stimulusType = this.persuasiveStimulusTypeForMovie(movieId);

      summary[stimulusType] += 1;
    }

    return summary;
  }

  private persuasiveStimulusTypeForMovie(movieId: number): PersuasiveStimulusType {
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
