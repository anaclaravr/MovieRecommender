import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ParticipantSessionService } from '../../core/services/participant-session.service';
import { MovieSelectionPage } from '../movie-selection/movie-selection.page';
import { NeutralExperiencePage } from '../neutral-experience/neutral-experience.page';

@Component({
  selector: 'app-experience-host-page',
  imports: [MovieSelectionPage, NeutralExperiencePage],
  templateUrl: './experience-host.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceHostPage {
  private readonly participantSessionService = inject(ParticipantSessionService);

  readonly experimentVariant = computed(
    () => this.participantSessionService.session().experimentVariant,
  );
}
