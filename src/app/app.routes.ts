import { Routes } from '@angular/router';

import { blockParticipantEntryEditGuard } from './core/guards/participant-entry-edit.guard';
import { ExperienceHostPage } from './features/experience-host/experience-host.page';
import { LoadingPage } from './features/loading/loading.page';
import { ParticipantEntryPage } from './features/participant-entry/participant-entry.page';
import { RecommendationsPage } from './features/recommendations/recommendations.page';
import { ChoiceFeedbackPage } from './features/choice-feedback/choice-feedback.page';
import { InstructionsPage } from './features/instructions/instructions.page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'participant-entry',
  },
  {
    path: 'participant-entry',
    component: ParticipantEntryPage,
    canActivate: [blockParticipantEntryEditGuard],
  },
  {
    path: 'instructions',
    component: InstructionsPage,
  },
  {
    path: 'movie-selection',
    component: ExperienceHostPage,
  },
  {
    path: 'loading',
    component: LoadingPage,
  },
  {
    path: 'recommendations',
    component: RecommendationsPage,
  },
  {
    path: 'choice-feedback',
    component: ChoiceFeedbackPage,
  },
];
