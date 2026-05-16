import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import { LoadingPage } from './loading.page';

describe('LoadingPage', () => {
  let httpMock: HttpTestingController;
  let participantSessionService: ParticipantSessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    participantSessionService = TestBed.inject(ParticipantSessionService);
    router = TestBed.inject(Router);
    participantSessionService.reset();
    participantSessionService.setBackendUserId(42);
    participantSessionService.setSelectedSeedMovieIds(MOCK_MOVIES.slice(0, 5).map((movie) => movie.id));
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('saves selected movies on the loading page before navigating to recommendations', () => {
    vi.useFakeTimers();

    const fixture = TestBed.createComponent(LoadingPage);
    fixture.detectChanges();

    const request = httpMock.expectOne((req) => req.url.endsWith('/users/42/favoritos/'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      filmes_ids: MOCK_MOVIES.slice(0, 5).map((movie) => movie.id),
    });

    request.flush([]);
    expect(router.navigateByUrl).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3200);

    expect(participantSessionService.session().selectedMediatedMovieIds).toEqual([]);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/recommendations');
  });

  it('keeps the user on loading and exposes an error when saving favorites fails', () => {
    vi.useFakeTimers();

    const fixture = TestBed.createComponent(LoadingPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const request = httpMock.expectOne((req) => req.url.endsWith('/users/42/favoritos/'));
    request.flush('Erro', { status: 500, statusText: 'Server Error' });
    vi.advanceTimersByTime(3200);

    expect(component.loadingError()).toBe(
      'Não foi possível salvar os filmes favoritos. Tente novamente.',
    );
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('restarts the registration from loading errors', () => {
    const fixture = TestBed.createComponent(LoadingPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const request = httpMock.expectOne((req) => req.url.endsWith('/users/42/favoritos/'));
    request.flush('Erro', { status: 500, statusText: 'Server Error' });

    component.restartRegistration();

    expect(participantSessionService.session().backendUserId).toBeUndefined();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/participant-entry');
  });
});
