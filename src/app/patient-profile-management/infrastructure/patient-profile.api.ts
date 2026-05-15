import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base.api';
import { PatientProfileEntity } from '../domain/model/patient-profile.entity';
import { PatientProfileApiEndpoint } from './patient-profile.api.endpoint';
import { PatientProfileAssembler } from './patient-profile.assembler';
import { PatientProfileResponse } from './patient-profile.response';

@Injectable({
  providedIn: 'root',
})
export class PatientProfileApi extends BaseApi<PatientProfileEntity, PatientProfileResponse> {
  constructor(private readonly patientProfileEndpoint: PatientProfileApiEndpoint) {
    super(patientProfileEndpoint, new PatientProfileAssembler());
  }

  getProfile(patientId: number): Observable<PatientProfileEntity | null> {
    return this.getOneFrom(this.patientProfileEndpoint.getById(patientId));
  }

  updateProfile(profile: PatientProfileEntity): Observable<PatientProfileEntity> {
    const resource = (this.assembler as PatientProfileAssembler).toResourceFrom(profile);

    return this.http
      .put<PatientProfileResponse>(this.patientProfileEndpoint.getById(profile.id), resource)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
