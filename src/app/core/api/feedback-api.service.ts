import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { ApiFeedbackCreate } from './api-types';

@Injectable({ providedIn: 'root' })
export class FeedbackApiService {
  private readonly http = inject(HttpClient);

  createFeedback(payload: ApiFeedbackCreate): Observable<unknown> {
    return this.http.post(`${API_BASE_URL}/formularios/`, payload);
  }
}

