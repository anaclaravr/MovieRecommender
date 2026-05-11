import { Injectable, inject, signal } from '@angular/core';

import { EventApiService } from '../api/event-api.service';
import {
  ExperienceCompletedPayload,
  ExperienceTrackingContext,
  ExperienceTrackingEvent,
  MovieSelectedPayload,
  PersuasiveStimulusType,
  ResourceType,
  SelectedStimulusSummary,
} from '../models/experience-tracking';
import { ParticipantSession } from '../models/participant-session';

const EXPERIENCE_EVENTS_STORAGE_KEY = 'movie-recommender-experience-events';

interface MovieSelectedInput {
  movieId: string;
  movieTitle: string;
  persuasiveStimulusType: PersuasiveStimulusType;
}

interface ExperienceCompletedInput {
  selectedMovieIds: string[];
  selectedStimulusSummary: SelectedStimulusSummary;
}

function readStoredEvents(): ExperienceTrackingEvent[] {
  if (typeof sessionStorage === 'undefined') {
    return [];
  }

  try {
    const storedEvents = sessionStorage.getItem(EXPERIENCE_EVENTS_STORAGE_KEY);

    if (!storedEvents) {
      return [];
    }

    const parsedEvents = JSON.parse(storedEvents);

    return Array.isArray(parsedEvents) ? (parsedEvents as ExperienceTrackingEvent[]) : [];
  } catch {
    return [];
  }
}

function persistEvents(events: ExperienceTrackingEvent[]): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(EXPERIENCE_EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch {
    return;
  }
}

@Injectable({ providedIn: 'root' })
export class ExperienceTrackingService {
  private readonly eventApiService = inject(EventApiService);
  private readonly eventsState = signal<ExperienceTrackingEvent[]>(readStoredEvents());

  readonly events = this.eventsState.asReadonly();

  createContext(session: ParticipantSession): ExperienceTrackingContext {
    return {
      session_id: session.sessionId,
      participant_id: session.backendUserId?.toString() ?? session.participantId,
      experiment_variant: session.experimentVariant,
    };
  }

  trackExperienceStarted(context: ExperienceTrackingContext): void {
    if (this.startedEventFor(context)) {
      return;
    }

    this.appendEvent({
      name: 'experience_started',
      payload: {
        ...context,
        started_at: new Date().toISOString(),
      },
    });
  }

  trackResourceUsed(context: ExperienceTrackingContext, resourceType: ResourceType): void {
    this.appendEvent({
      name: 'resource_used',
      payload: {
        ...context,
        resource_type: resourceType,
        timestamp: new Date().toISOString(),
      },
    });
  }

  trackMovieSelected(
    context: ExperienceTrackingContext,
    input: MovieSelectedInput,
  ): MovieSelectedPayload {
    const payload: MovieSelectedPayload = {
      ...context,
      movie_id: input.movieId,
      movie_title: input.movieTitle,
      selection_order: this.nextSelectionOrder(context),
      timestamp: new Date().toISOString(),
      details_opened_before_selection: this.hasResourceBeenUsed(context, 'details_opened'),
      search_used_before_selection: this.hasResourceBeenUsed(context, 'search'),
      genre_filter_used_before_selection: this.hasResourceBeenUsed(context, 'genre_filter'),
      persuasive_stimulus_type: input.persuasiveStimulusType,
    };

    this.appendEvent({
      name: 'movie_selected',
      payload,
    });

    return payload;
  }

  trackExperienceCompleted(
    context: ExperienceTrackingContext,
    input: ExperienceCompletedInput,
  ): ExperienceCompletedPayload {
    const completedAt = new Date();
    const payload: ExperienceCompletedPayload = {
      ...context,
      completed_at: completedAt.toISOString(),
      task_duration_ms: this.taskDurationMs(context, completedAt),
      selected_movie_ids: [...input.selectedMovieIds],
      selected_count: input.selectedMovieIds.length,
      details_open_count: this.resourceUseCount(context, 'details_opened'),
      search_count: this.resourceUseCount(context, 'search'),
      genre_filter_count: this.resourceUseCount(context, 'genre_filter'),
      selected_stimulus_summary: { ...input.selectedStimulusSummary },
    };

    this.appendEvent({
      name: 'experience_completed',
      payload,
    });

    return payload;
  }

  hasResourceBeenUsed(context: ExperienceTrackingContext, resourceType: ResourceType): boolean {
    return this.resourceUseCount(context, resourceType) > 0;
  }

  private appendEvent(event: ExperienceTrackingEvent): void {
    this.persistFallbackEvent(event);

    const backendUserId = Number(event.payload.participant_id);

    if (!Number.isFinite(backendUserId)) {
      return;
    }

    this.eventApiService
      .createEvent({
        session_id: event.payload.session_id,
        user_id: backendUserId,
        experiment_variant: event.payload.experiment_variant,
        event_name: event.name,
        event_timestamp: eventTimestamp(event),
        payload: { ...event.payload },
      })
      .subscribe({
        error: () => undefined,
      });
  }

  private persistFallbackEvent(event: ExperienceTrackingEvent): void {
    this.eventsState.update((events) => {
      const nextEvents = [...events, event];
      persistEvents(nextEvents);

      return nextEvents;
    });
  }

  private nextSelectionOrder(context: ExperienceTrackingContext): number {
    return (
      this.events().filter(
        (event) => event.name === 'movie_selected' && this.isSameContext(event.payload, context),
      ).length + 1
    );
  }

  private resourceUseCount(context: ExperienceTrackingContext, resourceType: ResourceType): number {
    return this.events().filter(
      (event) =>
        event.name === 'resource_used' &&
        this.isSameContext(event.payload, context) &&
        event.payload.resource_type === resourceType,
    ).length;
  }

  private taskDurationMs(context: ExperienceTrackingContext, completedAt: Date): number {
    const startedEvent = this.startedEventFor(context);

    if (!startedEvent) {
      return 0;
    }

    const startedAt = Date.parse(startedEvent.payload.started_at);

    if (Number.isNaN(startedAt)) {
      return 0;
    }

    return Math.max(0, completedAt.getTime() - startedAt);
  }

  private startedEventFor(
    context: ExperienceTrackingContext,
  ): Extract<ExperienceTrackingEvent, { name: 'experience_started' }> | undefined {
    return this.events().find(
      (event): event is Extract<ExperienceTrackingEvent, { name: 'experience_started' }> =>
        event.name === 'experience_started' && this.isSameContext(event.payload, context),
    );
  }

  private isSameContext(
    payload: ExperienceTrackingContext,
    context: ExperienceTrackingContext,
  ): boolean {
    return (
      payload.session_id === context.session_id &&
      payload.participant_id === context.participant_id &&
      payload.experiment_variant === context.experiment_variant
    );
  }
}

function eventTimestamp(event: ExperienceTrackingEvent): string {
  switch (event.name) {
    case 'experience_started':
      return event.payload.started_at;
    case 'resource_used':
    case 'movie_selected':
      return event.payload.timestamp;
    case 'experience_completed':
      return event.payload.completed_at;
  }
}
