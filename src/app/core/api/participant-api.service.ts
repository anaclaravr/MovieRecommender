import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { ApiUserCreate, ApiUserRead } from './api-types';

@Injectable({ providedIn: 'root' })
export class ParticipantApiService {
  private readonly http = inject(HttpClient);

  createUser(payload: ApiUserCreate): Observable<ApiUserRead> {
    return this.http.post<ApiUserRead>(`${API_BASE_URL}/users/`, payload);
  }
}

