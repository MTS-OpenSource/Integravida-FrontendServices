import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastucture/base.api';
import { DoctorEntity } from '../domain/model/doctor.entity';
import { DoctorApiEndpoint } from './doctor.api.endpoint';
import { DoctorAssembler } from './doctor.assembler';
import { DoctorResponse } from './doctor.response';

@Injectable({
  providedIn: 'root',
})
export class DoctorApi extends BaseApi<DoctorEntity, DoctorResponse> {
  constructor(private readonly doctorEndpoint: DoctorApiEndpoint) {
    super(doctorEndpoint, new DoctorAssembler());
  }

  getAll(): Observable<DoctorEntity[]> {
    return this.getAllFrom(this.doctorEndpoint.getAll());
  }
}
