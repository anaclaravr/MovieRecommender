import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ParticipantSessionService } from '../../core/services/participant-session.service';
import { ChoiceFeedbackPage } from './choice-feedback.page';

describe('ChoiceFeedbackPage', () => {
  let fixture: ComponentFixture<ChoiceFeedbackPage>;
  let component: ChoiceFeedbackPage;
  let httpMock: HttpTestingController;
  let participantSessionService: ParticipantSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceFeedbackPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    participantSessionService = TestBed.inject(ParticipantSessionService);
    participantSessionService.reset();

    fixture = TestBed.createComponent(ChoiceFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('uses a 7-point Likert scale with the expected labels', () => {
    expect(component.likertOptions).toEqual([
      { value: 1, label: 'Discordo totalmente' },
      { value: 2, label: 'Discordo' },
      { value: 3, label: 'Discordo um pouco' },
      { value: 4, label: 'Neutro' },
      { value: 5, label: 'Concordo um pouco' },
      { value: 6, label: 'Concordo' },
      { value: 7, label: 'Concordo totalmente' },
    ]);
  });

  it('uses the expected 8 mediated feedback questions', () => {
    expect(component.questions().map((question) => question.text)).toEqual([
      'Estou satisfeito(a) com os filmes que selecionei.',
      'Eu escolheria novamente os filmes selecionados.',
      'A escolha final refletiu minhas preferências pessoais.',
      'Foi difícil decidir quais filmes selecionar.',
      'A forma como os filmes foram apresentados me ajudou nas minhas escolhas.',
      'A plataforma me ajudou a encontrar filmes interessantes.',
      'Busquei mais informações sobre os filmes antes de finalizar minha escolha.',
      'As sugestões da plataforma me guiaram, mas a decisão final foi totalmente minha.',
    ]);
  });

  it('uses only the base 7 feedback questions for the neutral variant', () => {
    participantSessionService.setExperimentVariant('neutral');

    expect(component.questions().map((question) => question.text)).toEqual([
      'Estou satisfeito(a) com os filmes que selecionei.',
      'Eu escolheria novamente os filmes selecionados.',
      'A escolha final refletiu minhas preferências pessoais.',
      'Foi difícil decidir quais filmes selecionar.',
      'A forma como os filmes foram apresentados me ajudou nas minhas escolhas.',
      'A plataforma me ajudou a encontrar filmes interessantes.',
      'Busquei mais informações sobre os filmes antes de finalizar minha escolha.',
    ]);
  });

  it('sends mediated feedback with the guided-choice answer and trimmed comments', () => {
    participantSessionService.setBackendUserId(42);
    component.additionalComments.set('  Comentário livre  ');

    for (const question of component.questions()) {
      component.selectAnswer(question.id, 7);
    }

    component.submitQuestionnaire();

    const request = httpMock.expectOne((req) => req.url.endsWith('/formularios/'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      user_id: 42,
      selected_movies_satisfaction: 7,
      would_choose_again: 7,
      reflected_personal_preferences: 7,
      selection_difficulty: 7,
      presentation_helped_choice: 7,
      platform_helped_find_interesting_movies: 7,
      searched_more_information_before_final_choice: 7,
      platform_organization_influenced_choice: 7,
      felt_guided_by_platform: null,
      presentation_attracted_attention_over_prior_interest: null,
      additional_comments: 'Comentário livre',
    });

    request.flush({
      id: 1,
      user_id: 42,
      selected_movies_satisfaction: 7,
      would_choose_again: 7,
      reflected_personal_preferences: 7,
      selection_difficulty: 7,
      presentation_helped_choice: 7,
      platform_helped_find_interesting_movies: 7,
      searched_more_information_before_final_choice: 7,
      platform_organization_influenced_choice: 7,
      felt_guided_by_platform: null,
      presentation_attracted_attention_over_prior_interest: null,
      additional_comments: 'Comentário livre',
      created_at: '2026-05-15T00:00:00Z',
    });
  });

  it('sends neutral feedback influence fields as null', () => {
    participantSessionService.setExperimentVariant('neutral');
    participantSessionService.setBackendUserId(42);
    component.additionalComments.set('   ');

    for (const question of component.questions()) {
      component.selectAnswer(question.id, 6);
    }

    component.submitQuestionnaire();

    const request = httpMock.expectOne((req) => req.url.endsWith('/formularios/'));
    expect(request.request.body.additional_comments).toBeNull();
    expect(request.request.body.platform_organization_influenced_choice).toBeNull();
    expect(request.request.body.felt_guided_by_platform).toBeNull();
    expect(request.request.body.presentation_attracted_attention_over_prior_interest).toBeNull();

    request.flush({
      id: 1,
      user_id: 42,
      selected_movies_satisfaction: 6,
      would_choose_again: 6,
      reflected_personal_preferences: 6,
      selection_difficulty: 6,
      presentation_helped_choice: 6,
      platform_helped_find_interesting_movies: 6,
      searched_more_information_before_final_choice: 6,
      platform_organization_influenced_choice: null,
      felt_guided_by_platform: null,
      presentation_attracted_attention_over_prior_interest: null,
      additional_comments: null,
      created_at: '2026-05-15T00:00:00Z',
    });
  });

  it('shows a blocking success modal and prevents submitting again after success', () => {
    participantSessionService.setBackendUserId(42);

    for (const question of component.questions()) {
      component.selectAnswer(question.id, 7);
    }

    component.submitQuestionnaire();

    const request = httpMock.expectOne((req) => req.url.endsWith('/formularios/'));
    request.flush({
      id: 1,
      user_id: 42,
      selected_movies_satisfaction: 7,
      would_choose_again: 7,
      reflected_personal_preferences: 7,
      selection_difficulty: 7,
      presentation_helped_choice: 7,
      platform_helped_find_interesting_movies: 7,
      searched_more_information_before_final_choice: 7,
      platform_organization_influenced_choice: 7,
      felt_guided_by_platform: null,
      presentation_attracted_attention_over_prior_interest: null,
      additional_comments: null,
      created_at: '2026-05-15T00:00:00Z',
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.submitSuccess()).toBe(true);
    expect(component.isSubmitDisabled()).toBe(true);
    const dialog = compiled.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.querySelector('button')).toBeNull();
    expect(compiled.textContent).toContain('Obrigado por participar da pesquisa');
    expect(compiled.textContent).toContain('Seu questionário foi enviado com sucesso.');
    expect(compiled.textContent).not.toContain('Questionário enviado com sucesso.');

    component.submitQuestionnaire();

    httpMock.expectNone((req) => req.url.endsWith('/formularios/'));
  });

  it('does not submit when a Likert question is missing', () => {
    participantSessionService.setBackendUserId(42);

    for (const question of component.questions().slice(0, -1)) {
      component.selectAnswer(question.id, 7);
    }

    component.submitQuestionnaire();

    httpMock.expectNone((req) => req.url.endsWith('/formularios/'));
    expect(component.shouldShowQuestionError(8)).toBe(true);
  });

  it('does not require the mediated-only question for neutral submissions', () => {
    participantSessionService.setExperimentVariant('neutral');
    participantSessionService.setBackendUserId(42);

    for (const question of component.questions()) {
      component.selectAnswer(question.id, 7);
    }

    component.submitQuestionnaire();

    const request = httpMock.expectOne((req) => req.url.endsWith('/formularios/'));
    expect(request.request.body.platform_organization_influenced_choice).toBeNull();

    request.flush({
      id: 1,
      user_id: 42,
      selected_movies_satisfaction: 7,
      would_choose_again: 7,
      reflected_personal_preferences: 7,
      selection_difficulty: 7,
      presentation_helped_choice: 7,
      platform_helped_find_interesting_movies: 7,
      searched_more_information_before_final_choice: 7,
      platform_organization_influenced_choice: null,
      felt_guided_by_platform: null,
      presentation_attracted_attention_over_prior_interest: null,
      additional_comments: null,
      created_at: '2026-05-15T00:00:00Z',
    });
  });
});
