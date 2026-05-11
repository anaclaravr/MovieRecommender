export type ExperimentVariant = 'mediated' | 'neutral';
export type AppVariant = ExperimentVariant;
export type ParticipantAgeRange =
  | '18-24'
  | '25-30'
  | '31-36'
  | '37-42'
  | '43-48'
  | '49-54'
  | '55-60'
  | 'prefer-not-answer';
export type ParticipantEducationLevel =
  | 'elementary-incomplete'
  | 'elementary-complete'
  | 'high-school-incomplete'
  | 'high-school-complete'
  | 'higher-education-in-progress'
  | 'higher-education-complete'
  | 'postgraduate-in-progress'
  | 'postgraduate-complete'
  | 'prefer-not-answer';
export type ParticipantGender = 'female' | 'male' | 'non-binary' | 'other' | 'prefer-not-answer';

export interface ParticipantSession {
  sessionId: string;
  participantId: string;
  backendUserId?: number;
  name: string;
  email?: string;
  ageRange?: ParticipantAgeRange;
  profession?: string;
  educationLevel?: ParticipantEducationLevel;
  academicCourse?: string;
  gender?: ParticipantGender;
  genderDetail?: string;
  selectedSeedMovieIds: number[];
  selectedNeutralMovieIds: number[];
  experimentVariant: ExperimentVariant;
}
