import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { FeedbackApiService } from '../../core/api/feedback-api.service';
import { ParticipantSessionService } from '../../core/services/participant-session.service';

interface LikertOption {
  value: number;
  label: string;
}

interface FeedbackQuestion {
  id: number;
  text: string;
}

@Component({
  selector: 'app-choice-feedback-page',
  templateUrl: './choice-feedback.page.html',
  styleUrl: './choice-feedback.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoiceFeedbackPage {
  private readonly router = inject(Router);
  private readonly participantSessionService = inject(ParticipantSessionService);
  private readonly feedbackApiService = inject(FeedbackApiService);

  readonly questions: FeedbackQuestion[] = [
    { id: 1, text: 'Estou satisfeito(a) com os filmes que selecionei.' },
    { id: 2, text: 'Eu escolheria novamente os filmes selecionados.' },
    { id: 3, text: 'A escolha final refletiu minhas preferências pessoais.' },
    { id: 4, text: 'Foi difícil decidir quais filmes selecionar.' },
    { id: 5, text: 'A forma como os filmes foram apresentados ajudou na minha escolha.' },
    { id: 6, text: 'A plataforma me ajudou a encontrar filmes interessantes.' },
    {
      id: 7,
      text: 'Busquei mais informações sobre os filmes antes de finalizar minha escolha.',
    },
  ];
  readonly likertOptions: LikertOption[] = [
    { value: 1, label: 'Discordo totalmente' },
    { value: 2, label: 'Discordo' },
    { value: 3, label: 'Nem concordo nem discordo' },
    { value: 4, label: 'Concordo' },
    { value: 5, label: 'Concordo totalmente' },
  ];
  readonly selectedAnswers = signal<Record<number, number>>({});
  readonly attemptedSubmit = signal(false);
  readonly isSubmitting = signal(false);
  readonly submitError = signal('');
  readonly submitSuccess = signal(false);
  readonly isNeutralVariant = computed(
    () => this.participantSessionService.session().experimentVariant === 'neutral',
  );
  readonly canSubmit = computed(
    () => Object.keys(this.selectedAnswers()).length === this.questions.length,
  );

  goToParticipantEntry(): void {
    void this.router.navigateByUrl('/participant-entry');
  }

  goToMovieSelection(): void {
    void this.router.navigateByUrl('/movie-selection');
  }

  goToRecommendations(): void {
    void this.router.navigateByUrl('/recommendations');
  }

  goToPreviousExperienceStep(): void {
    const previousRoute = this.isNeutralVariant() ? '/movie-selection' : '/recommendations';

    void this.router.navigateByUrl(previousRoute);
  }

  selectAnswer(questionId: number, value: number): void {
    this.selectedAnswers.update((answers) => ({
      ...answers,
      [questionId]: value,
    }));
  }

  isAnswerSelected(questionId: number, value: number): boolean {
    return this.selectedAnswers()[questionId] === value;
  }

  shouldShowQuestionError(questionId: number): boolean {
    return this.attemptedSubmit() && this.selectedAnswers()[questionId] === undefined;
  }

  submitQuestionnaire(): void {
    this.attemptedSubmit.set(true);
    this.submitError.set('');
    this.submitSuccess.set(false);

    if (!this.canSubmit()) {
      return;
    }

    const userId = this.participantSessionService.session().backendUserId;

    if (!userId) {
      this.submitError.set('Participante sem ID do backend. Volte para a entrada e tente novamente.');
      return;
    }

    const answers = this.selectedAnswers();

    this.isSubmitting.set(true);
    this.feedbackApiService
      .createFeedback({
        user_id: userId,
        selected_movies_satisfaction: answers[1],
        would_choose_again: answers[2],
        reflected_personal_preferences: answers[3],
        selection_difficulty: answers[4],
        presentation_helped_choice: answers[5],
        platform_helped_find_interesting_movies: answers[6],
        searched_more_information_before_final_choice: answers[7],
      })
      .subscribe({
        next: () => this.submitSuccess.set(true),
        error: () => this.submitError.set('Nao foi possivel enviar o questionario. Tente novamente.'),
        complete: () => this.isSubmitting.set(false),
      });
  }
}
