import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ParticipantSessionService } from '../../core/services/participant-session.service';

@Component({
  selector: 'app-participant-entry-page',
  imports: [FormsModule],
  templateUrl: './participant-entry.page.html',
  styleUrl: './participant-entry.page.scss'
})
export class ParticipantEntryPage {
  private readonly router = inject(Router);
  private readonly participantSessionService = inject(ParticipantSessionService);

  name = this.participantSessionService.session().name;
  email = this.participantSessionService.session().email ?? '';

  get canContinue(): boolean {
    return this.name.trim().length > 0;
  }

  submit(): void {
    if (!this.canContinue) {
      return;
    }

    this.participantSessionService.setParticipant(this.name, this.email);
    void this.router.navigate(['/movie-selection']);
  }
}
