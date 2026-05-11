import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { ApiEventCreate } from './api-types';

@Injectable({ providedIn: 'root' })
export class EventApiService {
  private readonly http = inject(HttpClient);

  createEvent(payload: ApiEventCreate): Observable<unknown> {
    return this.http.post(`${API_BASE_URL}/eventos/`, payload);
  }
}

