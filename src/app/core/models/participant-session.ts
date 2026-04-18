export type AppVariant = 'mediated' | 'neutral';

export interface ParticipantSession {
  name: string;
  email?: string;
  selectedSeedMovieIds: string[];
  variant: AppVariant;
}
