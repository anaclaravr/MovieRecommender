import { Injectable, signal } from '@angular/core';

import { AppVariant, ParticipantSession } from '../models/participant-session';

function createInitialSession(): ParticipantSession {
  return {
    name: '',
    email: undefined,
    selectedSeedMovieIds: [],
    variant: 'neutral'
  };
}

@Injectable({ providedIn: 'root' })
export class ParticipantSessionService {
  private readonly sessionState = signal<ParticipantSession>(createInitialSession());

  readonly session = this.sessionState.asReadonly();

  setParticipant(name: string, email?: string): void {
    const trimmedName = name.trim();
    const trimmedEmail = email?.trim();

    this.sessionState.update((session) => ({
      ...session,
      name: trimmedName,
      email: trimmedEmail ? trimmedEmail : undefined
    }));
  }

  setSelectedSeedMovieIds(ids: string[]): void {
    this.sessionState.update((session) => ({
      ...session,
      selectedSeedMovieIds: [...ids]
    }));
  }

  setVariant(variant: AppVariant): void {
    this.sessionState.update((session) => ({
      ...session,
      variant
    }));
  }

  reset(): void {
    this.sessionState.set(createInitialSession());
  }
}
