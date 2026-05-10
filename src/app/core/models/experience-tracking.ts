import { ExperimentVariant } from './participant-session';

export type ExperienceEventName =
  | 'experience_started'
  | 'resource_used'
  | 'movie_selected'
  | 'experience_completed';

export type ResourceType = 'search' | 'genre_filter' | 'details_opened';

export const PERSUASIVE_STIMULUS_TYPES = [
  'top_1',
  'top_2',
  'top_3',
  'best_rated',
  'recommended_for_you',
  'none',
] as const;

export type PersuasiveStimulusType = (typeof PERSUASIVE_STIMULUS_TYPES)[number];

export type SelectedStimulusSummary = Record<PersuasiveStimulusType, number>;

export interface ExperienceTrackingContext {
  session_id: string;
  participant_id: string;
  experiment_variant: ExperimentVariant;
}

export interface ExperienceStartedPayload extends ExperienceTrackingContext {
  started_at: string;
}

export interface ResourceUsedPayload extends ExperienceTrackingContext {
  resource_type: ResourceType;
  timestamp: string;
}

export interface MovieSelectedPayload extends ExperienceTrackingContext {
  movie_id: string;
  movie_title: string;
  selection_order: number;
  timestamp: string;
  details_opened_before_selection: boolean;
  search_used_before_selection: boolean;
  genre_filter_used_before_selection: boolean;
  persuasive_stimulus_type: PersuasiveStimulusType;
}

export interface ExperienceCompletedPayload extends ExperienceTrackingContext {
  completed_at: string;
  task_duration_ms: number;
  selected_movie_ids: string[];
  selected_count: number;
  details_open_count: number;
  search_count: number;
  genre_filter_count: number;
  selected_stimulus_summary: SelectedStimulusSummary;
}

export type ExperienceTrackingEvent =
  | { name: 'experience_started'; payload: ExperienceStartedPayload }
  | { name: 'resource_used'; payload: ResourceUsedPayload }
  | { name: 'movie_selected'; payload: MovieSelectedPayload }
  | { name: 'experience_completed'; payload: ExperienceCompletedPayload };

export function createEmptySelectedStimulusSummary(): SelectedStimulusSummary {
  return {
    top_1: 0,
    top_2: 0,
    top_3: 0,
    best_rated: 0,
    recommended_for_you: 0,
    none: 0,
  };
}
