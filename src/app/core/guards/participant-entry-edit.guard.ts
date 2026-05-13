import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ParticipantSessionService } from '../services/participant-session.service';

export const blockParticipantEntryEditGuard: CanActivateFn = () => {
  const participantSessionService = inject(ParticipantSessionService);
  const router = inject(Router);

  if (participantSessionService.session().backendUserId) {
    return router.createUrlTree(['/instructions']);
  }

  return true;
};
