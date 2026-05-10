import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ParticipantSessionService } from '../../core/services/participant-session.service';

@Component({
  selector: 'app-instructions-page',
  templateUrl: './instructions.page.html',
  styleUrl: './instructions.page.scss',
})
export class InstructionsPage {
  private readonly router = inject(Router);
  private readonly participantSessionService = inject(ParticipantSessionService);

  readonly isNeutralVariant = computed(
    () => this.participantSessionService.session().experimentVariant === 'neutral',
  );

  goToParticipantEntry(): void {
    void this.router.navigateByUrl('/participant-entry');
  }

  startMovieSelection(): void {
    void this.router.navigateByUrl('/movie-selection');
  }
}
