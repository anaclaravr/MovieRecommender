import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ParticipantAgeRange,
  ParticipantEducationLevel,
  ParticipantSex,
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
  styleUrl: './participant-entry.page.scss'
})
export class ParticipantEntryPage {
  private readonly router = inject(Router);
  private readonly participantSessionService = inject(ParticipantSessionService);

  name = this.participantSessionService.session().name;
  email = this.participantSessionService.session().email ?? '';
  ageRange = this.participantSessionService.session().ageRange;
  profession = this.participantSessionService.session().profession ?? '';
  educationLevel = this.participantSessionService.session().educationLevel;
  undergraduateCourse = this.participantSessionService.session().undergraduateCourse ?? '';
  sex = this.participantSessionService.session().sex;

  readonly ageRangeOptions: SelectionOption<ParticipantAgeRange>[] = [
    { label: '18 a 24 anos', value: '18-24' },
    { label: '25 a 30 anos', value: '25-30' },
    { label: '31 a 36 anos', value: '31-36' },
    { label: '37 a 42 anos', value: '37-42' },
    { label: '43 a 48 anos', value: '43-48' },
    { label: '49 a 54 anos', value: '49-54' },
    { label: '55 a 60 anos', value: '55-60' },
  ];

  readonly educationLevelOptions: SelectionOption<ParticipantEducationLevel>[] = [
    { label: 'Ensino medio', value: 'high-school' },
    { label: 'Ensino tecnico', value: 'technical' },
    { label: 'Estudante de graduacao', value: 'undergraduate-student' },
    { label: 'Graduacao completa', value: 'undergraduate-complete' },
    { label: 'Pos-graduacao', value: 'postgraduate' },
    { label: 'Mestrado', value: 'masters' },
    { label: 'Doutorado', value: 'doctorate' },
  ];

  readonly sexOptions: SelectionOption<ParticipantSex>[] = [
    { label: 'Feminino', value: 'female' },
    { label: 'Masculino', value: 'male' },
  ];

  get canContinue(): boolean {
    return (
      this.name.trim().length > 0 &&
      !!this.ageRange &&
      this.profession.trim().length > 0 &&
      !!this.educationLevel &&
      (!this.requiresUndergraduateCourse || this.undergraduateCourse.trim().length > 0) &&
      !!this.sex
    );
  }

  get requiresUndergraduateCourse(): boolean {
    return this.educationLevel === 'undergraduate-student';
  }

  selectAgeRange(ageRange: ParticipantAgeRange): void {
    this.ageRange = ageRange;
  }

  selectEducationLevel(educationLevel: ParticipantEducationLevel): void {
    this.educationLevel = educationLevel;

    if (!this.requiresUndergraduateCourse) {
      this.undergraduateCourse = '';
    }
  }

  selectSex(sex: ParticipantSex): void {
    this.sex = sex;
  }

  submit(): void {
    if (!this.canContinue) {
      return;
    }

    const { ageRange, educationLevel, sex } = this;

    if (!ageRange || !educationLevel || !sex) {
      return;
    }

    this.participantSessionService.setParticipant(this.name, this.email, {
      ageRange,
      profession: this.profession,
      educationLevel,
      undergraduateCourse: this.requiresUndergraduateCourse ? this.undergraduateCourse : undefined,
      sex,
    });
    void this.router.navigate(['/movie-selection']);
  }
}
