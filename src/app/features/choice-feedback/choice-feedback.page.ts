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
    {
      id: 5,
      text: 'As informações apresentadas sobre os filmes me deram confiança para fazer minha escolha.',
    },
    { id: 6, text: 'A plataforma me ajudou a encontrar filmes interessantes.' },
    {
      id: 7,
      text: 'Busquei mais informações sobre os filmes antes de finalizar minha escolha.',
    },
    {
      id: 8,
      text: 'A forma como a plataforma organizou ou destacou os filmes influenciou minha escolha final.',
    },
    {
      id: 9,
      text: 'Senti que minha escolha foi guiada pela plataforma, além das minhas preferências pessoais.',
    },
    {
      id: 10,
      text: 'Alguns filmes chamaram minha atenção mais pela forma como foram apresentados do que pelo meu interesse prévio neles.',
    },
  ];
  readonly likertOptions: LikertOption[] = [
    { value: 1, label: 'Discordo totalmente' },
    { value: 2, label: 'Discordo' },
    { value: 3, label: 'Discordo um pouco' },
    { value: 4, label: 'Neutro' },
    { value: 5, label: 'Concordo um pouco' },
    { value: 6, label: 'Concordo' },
    { value: 7, label: 'Concordo totalmente' },
  ];
  readonly additionalCommentsMaxLength = 500;
  readonly selectedAnswers = signal<Record<number, number>>({});
  readonly additionalComments = signal('');
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
  readonly isSubmitDisabled = computed(() => this.isSubmitting() || this.submitSuccess());

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

  onAdditionalCommentsInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value.slice(0, this.additionalCommentsMaxLength);

    if (textarea.value !== value) {
      textarea.value = value;
    }

    this.additionalComments.set(value);
    this.resizeAdditionalComments(textarea);
  }

  submitQuestionnaire(): void {
    if (this.submitSuccess() || this.isSubmitting()) {
      return;
    }

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
        platform_organization_influenced_choice: answers[8],
        felt_guided_by_platform: answers[9],
        presentation_attracted_attention_over_prior_interest: answers[10],
        additional_comments: this.getAdditionalCommentsPayload(),
      })
      .subscribe({
        next: () => this.submitSuccess.set(true),
        error: () => this.submitError.set('Não foi possível enviar o questionário. Tente novamente.'),
        complete: () => this.isSubmitting.set(false),
      });
  }

  private getAdditionalCommentsPayload(): string | null {
    const comments = this.additionalComments().trim();
    return comments ? comments : null;
  }

  private resizeAdditionalComments(textarea: HTMLTextAreaElement): void {
    const styles = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(styles.lineHeight) || 24;
    const verticalPadding =
      Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom);
    const maxHeight = lineHeight * 4 + verticalPadding;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }
}
