import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import { NeutralExperiencePage } from './neutral-experience.page';

describe('NeutralExperiencePage', () => {
  let component: NeutralExperiencePage;
  let participantSessionService: ParticipantSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeutralExperiencePage],
      providers: [provideRouter([])],
    }).compileComponents();

    participantSessionService = TestBed.inject(ParticipantSessionService);
    participantSessionService.reset();

    const fixture = TestBed.createComponent(NeutralExperiencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('filters movies by title and genre', () => {
    component.updateSearchQuery('inter');

    expect(component.filteredCards().map((card) => card.movie.id)).toEqual(['interstellar']);

    component.updateSearchQuery('');
    component.selectGenre('Adventure');

    expect(component.filteredCards().length).toBeGreaterThan(0);
    expect(component.filteredCards().every((card) => card.movie.genres.includes('Adventure'))).toBe(
      true,
    );
  });

  it('syncs unlimited neutral selections to the participant session', () => {
    const firstSixMovieIds = MOCK_MOVIES.slice(0, 6).map((movie) => movie.id);

    for (const movieId of firstSixMovieIds) {
      component.toggleWouldWatch(movieId);
    }

    expect(component.selectedMovieIds()).toEqual(firstSixMovieIds);
    expect(participantSessionService.session().selectedNeutralMovieIds).toEqual(firstSixMovieIds);

    component.toggleWouldWatch(firstSixMovieIds[1]);

    expect(component.selectedMovieIds()).toEqual([
      firstSixMovieIds[0],
      ...firstSixMovieIds.slice(2),
    ]);
  });
});
