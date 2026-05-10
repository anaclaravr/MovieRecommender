import { Injectable, signal } from '@angular/core';

import {
  AppVariant,
  ParticipantAgeRange,
  ParticipantEducationLevel,
  ParticipantSession,
  ParticipantSex,
} from '../models/participant-session';

const SESSION_STORAGE_KEY = 'movie-recommender-participant-session';
const AGE_RANGES: ParticipantAgeRange[] = ['18-24', '25-30', '31-36', '37-42', '43-48', '49-54', '55-60'];
const EDUCATION_LEVELS: ParticipantEducationLevel[] = [
  'high-school',
  'technical',
  'undergraduate-student',
  'undergraduate-complete',
  'postgraduate',
  'masters',
  'doctorate',
];
const SEX_OPTIONS: ParticipantSex[] = ['female', 'male'];

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
    (session.ageRange === undefined || AGE_RANGES.includes(session.ageRange)) &&
    (session.profession === undefined || typeof session.profession === 'string') &&
    (session.educationLevel === undefined || EDUCATION_LEVELS.includes(session.educationLevel)) &&
    (session.undergraduateCourse === undefined || typeof session.undergraduateCourse === 'string') &&
    (session.sex === undefined || SEX_OPTIONS.includes(session.sex)) &&
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

  setParticipant(
    name: string,
    email: string | undefined,
    demographics: {
      ageRange: ParticipantAgeRange;
      profession: string;
      educationLevel: ParticipantEducationLevel;
      undergraduateCourse?: string;
      sex: ParticipantSex;
    }
  ): void {
    const trimmedName = name.trim();
    const trimmedEmail = email?.trim();
    const trimmedProfession = demographics.profession.trim();
    const trimmedUndergraduateCourse = demographics.undergraduateCourse?.trim();

    this.updateSession((session) => ({
      ...session,
      name: trimmedName,
      email: trimmedEmail ? trimmedEmail : undefined,
      ageRange: demographics.ageRange,
      profession: trimmedProfession,
      educationLevel: demographics.educationLevel,
      undergraduateCourse: trimmedUndergraduateCourse ? trimmedUndergraduateCourse : undefined,
      sex: demographics.sex,
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
