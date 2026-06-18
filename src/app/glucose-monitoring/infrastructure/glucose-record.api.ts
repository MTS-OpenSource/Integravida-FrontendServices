import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base.api';
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

  getByPatientId(patientId: number, from?: string, to?: string): Observable<GlucoseRecordEntity[]> {
    return this.http
      .get<GlucoseRecordResponse[]>(
        this.glucoseRecordEndpoint.getByPatientId(patientId, from, to),
      )
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  create(record: GlucoseRecordEntity): Observable<GlucoseRecordEntity> {
    return this.postTo(this.glucoseRecordEndpoint.getAll(), record.raw);
  }

  update(id: number, record: GlucoseRecordEntity): Observable<GlucoseRecordEntity> {
    return this.putTo(`${this.glucoseRecordEndpoint.getAll()}/${id}`, record.raw);
  }

  delete(id: number): Observable<void> {
    return this.deleteFrom(`${this.glucoseRecordEndpoint.getAll()}/${id}`);
  }
}
