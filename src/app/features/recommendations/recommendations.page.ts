import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ParticipantSessionService } from '../../core/services/participant-session.service';

@Component({
  selector: 'app-recommendations-page',
  imports: [JsonPipe, RouterLink],
  templateUrl: './recommendations.page.html',
  styleUrl: './recommendations.page.scss'
})
export class RecommendationsPage {
  private readonly participantSessionService = inject(ParticipantSessionService);

  readonly session = this.participantSessionService.session;
}
