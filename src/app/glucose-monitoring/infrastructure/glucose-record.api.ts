import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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

  getByPatientId(patientId: number): Observable<GlucoseRecordEntity[]> {
    return this.http
      .get<GlucoseRecordResponse[]>(this.glucoseRecordEndpoint.getByPatientId(patientId))
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  create(record: GlucoseRecordEntity): Observable<GlucoseRecordEntity> {
    return this.http
      .post<GlucoseRecordResponse>(this.glucoseRecordEndpoint.getAll(), record)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  update(id: number, record: GlucoseRecordEntity): Observable<GlucoseRecordEntity> {
    return this.http
      .put<GlucoseRecordResponse>(`${this.glucoseRecordEndpoint.getAll()}/${id}`, record)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.glucoseRecordEndpoint.getAll()}/${id}`);
  }
}
