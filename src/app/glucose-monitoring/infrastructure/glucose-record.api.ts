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

  getByPatientId(patientId: string | number, from?: string, to?: string): Observable<GlucoseRecordEntity[]> {
    return this.http
      .get<GlucoseRecordResponse[]>(this.glucoseRecordEndpoint.getByPatientId(patientId, from, to))
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  create(record: GlucoseRecordEntity): Observable<GlucoseRecordEntity> {
    return this.http
      .post<GlucoseRecordResponse>(this.glucoseRecordEndpoint.getAll(), record.raw)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  update(id: string | number, record: GlucoseRecordEntity): Observable<GlucoseRecordEntity> {
    return this.http
      .put<GlucoseRecordResponse>(this.glucoseRecordEndpoint.getById(id), record.raw)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(this.glucoseRecordEndpoint.getById(id));
  }
}
