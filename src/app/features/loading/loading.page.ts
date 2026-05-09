import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading.page.html',
  styleUrl: './loading.page.scss',
})
export class LoadingPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  private readonly analysisSteps = [
    'Identificando padrões cinematográficos',
    'Buscando filmes similares',
    'Calculando compatibilidade',
  ];

  readonly visibleAnalysisSteps = signal<string[]>([]);

  ngOnInit(): void {
    this.queueTimer(() => this.revealStep(0), 700);
    this.queueTimer(() => this.revealStep(1), 1500);
    this.queueTimer(() => this.revealStep(2), 2300);
    this.queueTimer(() => void this.router.navigateByUrl('/recommendations'), 3200);
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
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
}
