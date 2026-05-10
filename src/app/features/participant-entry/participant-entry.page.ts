import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ExperimentVariant,
  ParticipantAgeRange,
  ParticipantEducationLevel,
  ParticipantGender,
} from '../../core/models/participant-session';
import { ParticipantSessionService } from '../../core/services/participant-session.service';

interface SelectionOption<T extends string> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-participant-entry-page',
  imports: [FormsModule],
  templateUrl: './participant-entry.page.html',
  styleUrl: './participant-entry.page.scss',
})
export class ParticipantEntryPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly participantSessionService = inject(ParticipantSessionService);

  name = this.participantSessionService.session().name;
  email = this.participantSessionService.session().email ?? '';
  ageRange = this.participantSessionService.session().ageRange;
  profession = this.participantSessionService.session().profession ?? '';
  educationLevel = this.participantSessionService.session().educationLevel;
  academicCourse = this.participantSessionService.session().academicCourse ?? '';
  gender = this.participantSessionService.session().gender;
  genderDetail = this.participantSessionService.session().genderDetail ?? '';
  experimentVariant = this.participantSessionService.session().experimentVariant;

  readonly ageRangeOptions: SelectionOption<ParticipantAgeRange>[] = [
    { label: '18 a 24 anos', value: '18-24' },
    { label: '25 a 30 anos', value: '25-30' },
    { label: '31 a 36 anos', value: '31-36' },
    { label: '37 a 42 anos', value: '37-42' },
    { label: '43 a 48 anos', value: '43-48' },
    { label: '49 a 54 anos', value: '49-54' },
    { label: '55 ou mais', value: '55-60' },
    { label: 'Prefiro não responder', value: 'prefer-not-answer' },
  ];

  readonly educationLevelOptions: SelectionOption<ParticipantEducationLevel>[] = [
    { label: 'Ensino fundamental incompleto', value: 'elementary-incomplete' },
    { label: 'Ensino fundamental completo', value: 'elementary-complete' },
    { label: 'Ensino médio incompleto', value: 'high-school-incomplete' },
    { label: 'Ensino médio completo', value: 'high-school-complete' },
    { label: 'Ensino superior em andamento', value: 'higher-education-in-progress' },
    { label: 'Ensino superior completo', value: 'higher-education-complete' },
    { label: 'Pós-graduação em andamento', value: 'postgraduate-in-progress' },
    { label: 'Pós-graduação completa', value: 'postgraduate-complete' },
    { label: 'Prefiro não responder', value: 'prefer-not-answer' },
  ];

  readonly genderOptions: SelectionOption<ParticipantGender>[] = [
    { label: 'Feminino', value: 'female' },
    { label: 'Masculino', value: 'male' },
    { label: 'Não binário', value: 'non-binary' },
    { label: 'Outro', value: 'other' },
    { label: 'Prefiro não responder', value: 'prefer-not-answer' },
  ];

  get canContinue(): boolean {
    return this.name.trim().length > 0 && !!this.ageRange && !!this.educationLevel && !!this.gender;
  }

  get asksAcademicCourse(): boolean {
    return (
      this.educationLevel === 'higher-education-in-progress' ||
      this.educationLevel === 'higher-education-complete' ||
      this.educationLevel === 'postgraduate-in-progress' ||
      this.educationLevel === 'postgraduate-complete'
    );
  }

  get asksGenderDetail(): boolean {
    return this.gender === 'other';
  }

  get requiredFieldsTotal(): number {
    return 4;
  }

  get requiredFieldsCompleted(): number {
    const completedFields = [
      this.name.trim().length > 0,
      !!this.ageRange,
      !!this.educationLevel,
      !!this.gender,
    ];

    return completedFields.filter(Boolean).length;
  }

  selectAgeRange(ageRange: ParticipantAgeRange): void {
    this.ageRange = ageRange;
  }

  selectEducationLevel(educationLevel: ParticipantEducationLevel): void {
    this.educationLevel = educationLevel;

    if (!this.asksAcademicCourse) {
      this.academicCourse = '';
    }
  }

  selectGender(gender: ParticipantGender): void {
    this.gender = gender;

    if (!this.asksGenderDetail) {
      this.genderDetail = '';
    }
  }

  submit(): void {
    if (!this.canContinue) {
      return;
    }

    const { ageRange, educationLevel, gender } = this;

    if (!ageRange || !educationLevel || !gender) {
      return;
    }

    const experimentVariant = this.getAssignedExperimentVariant();

    this.participantSessionService.setParticipant(this.name, this.email, {
      ageRange,
      profession: this.profession,
      educationLevel,
      academicCourse: this.asksAcademicCourse ? this.academicCourse : undefined,
      gender,
      genderDetail: this.asksGenderDetail ? this.genderDetail : undefined,
    });
    this.participantSessionService.setExperimentVariant(experimentVariant);
    this.experimentVariant = experimentVariant;
    void this.router.navigate(['/instructions']);
  }

  private getAssignedExperimentVariant(): ExperimentVariant {
    const queryParamVariant =
      this.route.snapshot.queryParamMap.get('experimentVariant') ??
      this.route.snapshot.queryParamMap.get('variant');

    if (queryParamVariant === 'mediated' || queryParamVariant === 'neutral') {
      return queryParamVariant;
    }

    return this.experimentVariant;
  }
}
