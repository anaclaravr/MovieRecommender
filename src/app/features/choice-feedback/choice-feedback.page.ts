import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface LikertOption {
  value: number;
  label: string;
}

interface FeedbackQuestion {
  id: number;
  text: string;
}

const QUESTION_COUNT = 10;
const QUESTION_PLACEHOLDER =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

@Component({
  selector: 'app-choice-feedback-page',
  templateUrl: './choice-feedback.page.html',
  styleUrl: './choice-feedback.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoiceFeedbackPage {
  private readonly router = inject(Router);

  readonly questions: FeedbackQuestion[] = Array.from({ length: QUESTION_COUNT }, (_, index) => ({
    id: index + 1,
    text: QUESTION_PLACEHOLDER,
  }));
  readonly likertOptions: LikertOption[] = [
    { value: 1, label: 'Muito insatisfeito' },
    { value: 2, label: 'Insatisfeito' },
    { value: 3, label: 'Indiferente' },
    { value: 4, label: 'Satisfeito' },
    { value: 5, label: 'Muito satisfeito' },
  ];
  readonly selectedAnswers = signal<Record<number, number>>({});
  readonly canSubmit = computed(() => Object.keys(this.selectedAnswers()).length === QUESTION_COUNT);

  goToParticipantEntry(): void {
    void this.router.navigateByUrl('/participant-entry');
  }

  goToMovieSelection(): void {
    void this.router.navigateByUrl('/movie-selection');
  }

  goToRecommendations(): void {
    void this.router.navigateByUrl('/recommendations');
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

  submitQuestionnaire(): void {
    if (!this.canSubmit()) {
      return;
    }
  }
}
