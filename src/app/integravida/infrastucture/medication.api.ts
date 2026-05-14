import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastucture/base.api';
import { MedicationEntity } from '../domain/model/medication.entity';
import { MedicationApiEndpoint } from './medication.api.endpoint';
import { MedicationAssembler } from './medication.assembler';
import { MedicationResponse } from './medication.response';

@Injectable({
  providedIn: 'root',
})
export class MedicationApi extends BaseApi<MedicationEntity, MedicationResponse> {
  constructor(private readonly medicationEndpoint: MedicationApiEndpoint) {
    super(medicationEndpoint, new MedicationAssembler());
  }

  getAll(): Observable<MedicationEntity[]> {
    return this.getAllFrom(this.medicationEndpoint.getAll());
  }
}
