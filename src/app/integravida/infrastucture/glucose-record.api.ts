import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastucture/base.api';
import { GlucoseRecordEntity } from '../domain/model/glucose-record.entity';
import { GlucoseRecordApiEndpoint } from './glucose-record.api.endpoint';
import { GlucoseRecordAssembler } from './glucose-record.assembler';
import { GlucoseRecordResponse } from './glucose-record.response';

@Injectable({
  providedIn: 'root',
})
export class GlucoseRecordApi extends BaseApi<GlucoseRecordEntity, GlucoseRecordResponse> {
  constructor(private readonly glucoseRecordEndpoint: GlucoseRecordApiEndpoint) {
    super(glucoseRecordEndpoint, new GlucoseRecordAssembler());
  }

  getAll(): Observable<GlucoseRecordEntity[]> {
    return this.getAllFrom(this.glucoseRecordEndpoint.getAll());
  }
}
