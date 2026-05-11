import {
  ExperimentVariant,
  ParticipantAgeRange,
  ParticipantEducationLevel,
  ParticipantGender,
} from '../models/participant-session';

export interface ApiPage<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiMovie {
  id: number;
  movie_id: number;
  tmdb_id?: number | null;
  title: string;
  title_translation?: string | null;
  year?: number | null;
  genres: string[];
  poster_url?: string | null;
  average_rating?: number | string | null;
  rating_count: number;
  popularity?: number | string | null;
  runtime?: number | null;
  synopsis?: string | null;
}

export interface ApiUserCreate {
  name: string;
  email?: string;
  current_occupation?: string;
  age_range: ApiAgeRange;
  education_level: ApiEducationLevel;
  course?: string;
  gender: ApiGender;
  gender_description?: string;
}

export interface ApiUserRead extends ApiUserCreate {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiFavoriteMoviesPayload {
  filmes_ids: number[];
}

export interface ApiFavoriteRead {
  id: number;
  user_id: number;
  filme_id: number;
  selected_at: string;
}

export interface ApiRecommendationRead {
  id: number;
  user_id: number;
  filme_id: number;
  similarity_score: number | string;
  rank_position: number;
  recommended_at?: string | null;
}

export interface ApiRecommendationTestDriveRead extends ApiRecommendationRead {
  filme: ApiMovie;
}

export interface ApiEventCreate {
  session_id: string;
  user_id: number;
  experiment_variant: ExperimentVariant;
  event_name: string;
  event_timestamp: string;
  payload: Record<string, unknown>;
}

export interface ApiFeedbackCreate {
  user_id: number;
  selected_movies_satisfaction: number;
  would_choose_again: number;
  reflected_personal_preferences: number;
  selection_difficulty: number;
  presentation_helped_choice: number;
  platform_helped_find_interesting_movies: number;
  searched_more_information_before_final_choice: number;
}

export type ApiAgeRange =
  | '18_24'
  | '25_30'
  | '31_36'
  | '37_42'
  | '43_48'
  | '49_54'
  | '55_plus'
  | 'prefer_not_to_answer';

export type ApiEducationLevel =
  | 'elementary_incomplete'
  | 'elementary_complete'
  | 'high_school_incomplete'
  | 'high_school_complete'
  | 'higher_education_in_progress'
  | 'higher_education_complete'
  | 'postgraduate_in_progress'
  | 'postgraduate_complete'
  | 'prefer_not_to_answer';

export type ApiGender = 'female' | 'male' | 'non_binary' | 'other' | 'prefer_not_to_answer';

export function toApiAgeRange(ageRange: ParticipantAgeRange): ApiAgeRange {
  if (ageRange === '55-60') {
    return '55_plus';
  }

  return toApiEnumValue(ageRange) as ApiAgeRange;
}

export function toApiEducationLevel(educationLevel: ParticipantEducationLevel): ApiEducationLevel {
  return toApiEnumValue(educationLevel) as ApiEducationLevel;
}

export function toApiGender(gender: ParticipantGender): ApiGender {
  return toApiEnumValue(gender) as ApiGender;
}

function toApiEnumValue(value: string): string {
  if (value === 'prefer-not-answer') {
    return 'prefer_not_to_answer';
  }

  return value.replaceAll('-', '_');
}

