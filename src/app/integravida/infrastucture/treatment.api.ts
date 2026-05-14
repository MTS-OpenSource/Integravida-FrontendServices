import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastucture/base.api';
import { TreatmentEntity } from '../domain/model/treatment.entity';
import { TreatmentApiEndpoint } from './treatment.api.endpoint';
import { TreatmentAssembler } from './treatment.assembler';
import { TreatmentResponse } from './treatment.response';

@Injectable({
  providedIn: 'root',
})
export class TreatmentApi extends BaseApi<TreatmentEntity, TreatmentResponse> {
  constructor(private readonly treatmentEndpoint: TreatmentApiEndpoint) {
    super(treatmentEndpoint, new TreatmentAssembler());
  }

  getAll(): Observable<TreatmentEntity[]> {
    return this.getAllFrom(this.treatmentEndpoint.getAll());
  }
}
