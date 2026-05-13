import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RecommendationApiService } from '../../core/api/recommendation-api.service';
import { ParticipantSessionService } from '../../core/services/participant-session.service';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading.page.html',
  styleUrl: './loading.page.scss',
})
export class LoadingPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly recommendationApiService = inject(RecommendationApiService);
  private readonly participantSessionService = inject(ParticipantSessionService);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  private saveFavoritesSubscription?: Subscription;
  private canNavigateToRecommendations = false;
  private hasSavedFavorites = false;

  private readonly analysisSteps = [
    'Identificando padrões cinematográficos',
    'Buscando filmes similares',
    'Calculando compatibilidade',
  ];

  readonly visibleAnalysisSteps = signal<string[]>([]);
  readonly loadingError = signal('');

  ngOnInit(): void {
    this.queueTimer(() => this.revealStep(0), 700);
    this.queueTimer(() => this.revealStep(1), 1500);
    this.queueTimer(() => this.revealStep(2), 2300);
    this.queueTimer(() => {
      this.canNavigateToRecommendations = true;
      this.navigateWhenReady();
    }, 3200);
    this.saveFavorites();
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.saveFavoritesSubscription?.unsubscribe();
  }

  retrySaveFavorites(): void {
    this.saveFavorites();
  }

  goBackToMovieSelection(): void {
    void this.router.navigateByUrl('/movie-selection');
  }

  private queueTimer(callback: () => void, delay: number): void {
    this.timers.push(setTimeout(callback, delay));
  }

  private revealStep(stepIndex: number): void {
    const step = this.analysisSteps[stepIndex];

    if (!step) {
      return;
    }

    this.visibleAnalysisSteps.update((steps) => [...steps, step]);
  }

  private saveFavorites(): void {
    const backendUserId = this.participantSessionService.session().backendUserId;
    const selectedMovieIds = this.participantSessionService.session().selectedSeedMovieIds.slice(
      0,
      5,
    );

    this.saveFavoritesSubscription?.unsubscribe();
    this.loadingError.set('');
    this.hasSavedFavorites = false;

    if (!backendUserId) {
      this.loadingError.set('Crie o participante novamente antes de salvar os filmes.');
      return;
    }

    if (selectedMovieIds.length !== 5) {
      this.loadingError.set('Selecione 5 filmes antes de gerar recomendações.');
      return;
    }

    this.saveFavoritesSubscription = this.recommendationApiService
      .saveFavoriteMovies(backendUserId, selectedMovieIds)
      .subscribe({
        next: () => {
          this.participantSessionService.setSelectedMediatedMovieIds([]);
          this.hasSavedFavorites = true;
          this.navigateWhenReady();
        },
        error: () => {
          this.loadingError.set('Não foi possível salvar os filmes favoritos. Tente novamente.');
        },
      });
  }

  private navigateWhenReady(): void {
    if (!this.canNavigateToRecommendations || !this.hasSavedFavorites) {
      return;
    }

    void this.router.navigateByUrl('/recommendations');
  }
}
