import { Routes } from '@angular/router';

import { LoadingPage } from './features/loading/loading.page';
import { MovieSelectionPage } from './features/movie-selection/movie-selection.page';
import { ParticipantEntryPage } from './features/participant-entry/participant-entry.page';
import { RecommendationsPage } from './features/recommendations/recommendations.page';
import { ChoiceFeedbackPage } from './features/choice-feedback/choice-feedback.page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'participant-entry'
  },
  {
    path: 'participant-entry',
    component: ParticipantEntryPage
  },
  {
    path: 'movie-selection',
    component: MovieSelectionPage
  },
  {
    path: 'loading',
    component: LoadingPage
  },
  {
    path: 'recommendations',
    component: RecommendationsPage
  },
  {
    path: 'choice-feedback',
    component: ChoiceFeedbackPage
  }
];
