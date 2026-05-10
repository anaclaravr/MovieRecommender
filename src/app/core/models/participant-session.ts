export type AppVariant = 'mediated' | 'neutral';
export type ParticipantAgeRange =
  | '18-24'
  | '25-30'
  | '31-36'
  | '37-42'
  | '43-48'
  | '49-54'
  | '55-60';
export type ParticipantEducationLevel =
  | 'high-school'
  | 'technical'
  | 'undergraduate-student'
  | 'undergraduate-complete'
  | 'postgraduate'
  | 'masters'
  | 'doctorate';
export type ParticipantSex = 'female' | 'male';

export interface ParticipantSession {
  name: string;
  email?: string;
  ageRange?: ParticipantAgeRange;
  profession?: string;
  educationLevel?: ParticipantEducationLevel;
  undergraduateCourse?: string;
  sex?: ParticipantSex;
  selectedSeedMovieIds: string[];
  variant: AppVariant;
}
