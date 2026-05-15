import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base.api';
import { PatientEntity } from '../domain/model/patient.entity';
import { PatientAssembler } from './patient.assembler';
import { PatientApiEndpoint } from './patient.api.endpoint';
import { PatientResponse } from './patient.response';

@Injectable({
  providedIn: 'root',
})
export class PatientApi extends BaseApi<PatientEntity, PatientResponse> {
  constructor(private readonly patientEndpoint: PatientApiEndpoint) {
    super(patientEndpoint, new PatientAssembler());
  }

  getAll(): Observable<PatientEntity[]> {
    return this.getAllFrom(this.patientEndpoint.getAll());
  }
}
