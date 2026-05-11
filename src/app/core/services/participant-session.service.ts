import { Injectable, signal } from '@angular/core';

import {
  ExperimentVariant,
  ParticipantAgeRange,
  ParticipantEducationLevel,
  ParticipantGender,
  ParticipantSession,
} from '../models/participant-session';

const SESSION_STORAGE_KEY = 'movie-recommender-participant-session';
const AGE_RANGES: ParticipantAgeRange[] = [
  '18-24',
  '25-30',
  '31-36',
  '37-42',
  '43-48',
  '49-54',
  '55-60',
  'prefer-not-answer',
];
const EDUCATION_LEVELS: ParticipantEducationLevel[] = [
  'elementary-incomplete',
  'elementary-complete',
  'high-school-incomplete',
  'high-school-complete',
  'higher-education-in-progress',
  'higher-education-complete',
  'postgraduate-in-progress',
  'postgraduate-complete',
  'prefer-not-answer',
];
const GENDER_OPTIONS: ParticipantGender[] = [
  'female',
  'male',
  'non-binary',
  'other',
  'prefer-not-answer',
];
const EXPERIMENT_VARIANTS: ExperimentVariant[] = ['mediated', 'neutral'];

type StoredParticipantSession = Partial<ParticipantSession> & {
  variant?: ExperimentVariant;
};

function createTrackingId(prefix: string): string {
  const randomValue =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}-${randomValue}`;
}

function createInitialSession(): ParticipantSession {
  return {
    sessionId: createTrackingId('session'),
    participantId: createTrackingId('participant'),
    name: '',
    email: undefined,
    selectedSeedMovieIds: [],
    selectedNeutralMovieIds: [],
    experimentVariant: 'mediated',
  };
}

function isExperimentVariant(value: unknown): value is ExperimentVariant {
  return typeof value === 'string' && EXPERIMENT_VARIANTS.includes(value as ExperimentVariant);
}

function normalizeParticipantSession(value: unknown): ParticipantSession | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const session = value as StoredParticipantSession;
  const experimentVariant = session.experimentVariant ?? session.variant;

  if (
    typeof session.name !== 'string' ||
    !Array.isArray(session.selectedSeedMovieIds) ||
    !session.selectedSeedMovieIds.every((id) => typeof id === 'number') ||
    (session.selectedNeutralMovieIds !== undefined &&
      (!Array.isArray(session.selectedNeutralMovieIds) ||
        !session.selectedNeutralMovieIds.every((id) => typeof id === 'number'))) ||
    (session.backendUserId !== undefined && typeof session.backendUserId !== 'number') ||
    (session.email !== undefined && typeof session.email !== 'string') ||
    (session.ageRange !== undefined && !AGE_RANGES.includes(session.ageRange)) ||
    (session.profession !== undefined && typeof session.profession !== 'string') ||
    (session.educationLevel !== undefined &&
      !EDUCATION_LEVELS.includes(session.educationLevel)) ||
    (session.academicCourse !== undefined && typeof session.academicCourse !== 'string') ||
    (session.gender !== undefined && !GENDER_OPTIONS.includes(session.gender)) ||
    (session.genderDetail !== undefined && typeof session.genderDetail !== 'string') ||
    !isExperimentVariant(experimentVariant)
  ) {
    return null;
  }

  return {
    sessionId:
      typeof session.sessionId === 'string' && session.sessionId.trim().length > 0
        ? session.sessionId
        : createTrackingId('session'),
    participantId:
      typeof session.participantId === 'string' && session.participantId.trim().length > 0
        ? session.participantId
        : createTrackingId('participant'),
    backendUserId: session.backendUserId,
    name: session.name,
    email: session.email,
    ageRange: session.ageRange,
    profession: session.profession,
    educationLevel: session.educationLevel,
    academicCourse: session.academicCourse,
    gender: session.gender,
    genderDetail: session.genderDetail,
    selectedSeedMovieIds: [...session.selectedSeedMovieIds],
    selectedNeutralMovieIds: [...(session.selectedNeutralMovieIds ?? [])],
    experimentVariant,
  };
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

    return normalizeParticipantSession(parsedSession) ?? createInitialSession();
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
      profession?: string;
      educationLevel: ParticipantEducationLevel;
      academicCourse?: string;
      gender: ParticipantGender;
      genderDetail?: string;
    },
  ): void {
    const trimmedName = name.trim();
    const trimmedEmail = email?.trim();
    const trimmedProfession = demographics.profession?.trim();
    const trimmedAcademicCourse = demographics.academicCourse?.trim();
    const trimmedGenderDetail = demographics.genderDetail?.trim();

    this.updateSession((session) => ({
      ...session,
      name: trimmedName,
      email: trimmedEmail ? trimmedEmail : undefined,
      ageRange: demographics.ageRange,
      profession: trimmedProfession ? trimmedProfession : undefined,
      educationLevel: demographics.educationLevel,
      academicCourse: trimmedAcademicCourse ? trimmedAcademicCourse : undefined,
      gender: demographics.gender,
      genderDetail: trimmedGenderDetail ? trimmedGenderDetail : undefined,
    }));
  }

  setBackendUserId(backendUserId: number): void {
    this.updateSession((session) => ({
      ...session,
      backendUserId,
    }));
  }

  setSelectedSeedMovieIds(ids: number[]): void {
    this.updateSession((session) => ({
      ...session,
      selectedSeedMovieIds: [...ids],
    }));
  }

  setSelectedNeutralMovieIds(ids: number[]): void {
    this.updateSession((session) => ({
      ...session,
      selectedNeutralMovieIds: Array.from(new Set(ids)),
    }));
  }

  setExperimentVariant(experimentVariant: ExperimentVariant): void {
    this.updateSession((session) => ({
      ...session,
      experimentVariant,
    }));
  }

  setVariant(variant: ExperimentVariant): void {
    this.setExperimentVariant(variant);
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
