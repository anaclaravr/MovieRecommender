import { Injectable, signal } from '@angular/core';

import { AppVariant, ParticipantSession } from '../models/participant-session';

const SESSION_STORAGE_KEY = 'movie-recommender-participant-session';

function createInitialSession(): ParticipantSession {
  return {
    name: '',
    email: undefined,
    selectedSeedMovieIds: [],
    variant: 'neutral',
  };
}

function isParticipantSession(value: unknown): value is ParticipantSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Partial<ParticipantSession>;

  return (
    typeof session.name === 'string' &&
    Array.isArray(session.selectedSeedMovieIds) &&
    session.selectedSeedMovieIds.every((id) => typeof id === 'string') &&
    (session.email === undefined || typeof session.email === 'string') &&
    (session.variant === 'mediated' || session.variant === 'neutral')
  );
}

function readStoredSession(): ParticipantSession {
  if (typeof sessionStorage === 'undefined') {
    return createInitialSession();
  }

  try {
    const storedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSession) {
      return createInitialSession();
    }

    const parsedSession = JSON.parse(storedSession);

    return isParticipantSession(parsedSession) ? parsedSession : createInitialSession();
  } catch {
    return createInitialSession();
  }
}

function persistSession(session: ParticipantSession): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

@Injectable({ providedIn: 'root' })
export class ParticipantSessionService {
  private readonly sessionState = signal<ParticipantSession>(readStoredSession());

  readonly session = this.sessionState.asReadonly();

  setParticipant(name: string, email?: string): void {
    const trimmedName = name.trim();
    const trimmedEmail = email?.trim();

    this.updateSession((session) => ({
      ...session,
      name: trimmedName,
      email: trimmedEmail ? trimmedEmail : undefined,
    }));
  }

  setSelectedSeedMovieIds(ids: string[]): void {
    this.updateSession((session) => ({
      ...session,
      selectedSeedMovieIds: [...ids],
    }));
  }

  setVariant(variant: AppVariant): void {
    this.updateSession((session) => ({
      ...session,
      variant,
    }));
  }

  reset(): void {
    const initialSession = createInitialSession();

    this.sessionState.set(initialSession);
    persistSession(initialSession);
  }

  private updateSession(projector: (session: ParticipantSession) => ParticipantSession): void {
    const nextSession = projector(this.sessionState());

    this.sessionState.set(nextSession);
    persistSession(nextSession);
  }
}
