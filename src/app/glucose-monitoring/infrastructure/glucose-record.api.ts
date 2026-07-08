import { HttpHeaders } from '@angular/common/http';
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

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(token: string): Observable<GlucoseRecordEntity[]> {
    return this.http
      .get<GlucoseRecordResponse[]>(this.glucoseRecordEndpoint.getAll(), {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  getByPatientId(token: string, from?: string, to?: string): Observable<GlucoseRecordEntity[]> {
    return this.http
      .get<GlucoseRecordResponse[]>(this.glucoseRecordEndpoint.getByPatientId(from, to), {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  create(token: string, record: GlucoseRecordEntity): Observable<GlucoseRecordEntity> {
    return this.http
      .post<GlucoseRecordResponse>(this.glucoseRecordEndpoint.getAll(), record.raw, {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  update(token: string, id: string | number, record: GlucoseRecordEntity): Observable<GlucoseRecordEntity> {
    return this.http
      .put<GlucoseRecordResponse>(this.glucoseRecordEndpoint.getById(id), record.raw, {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  delete(token: string, id: string | number): Observable<void> {
    return this.http.delete<void>(this.glucoseRecordEndpoint.getById(id), {
      headers: this.authHeaders(token),
    });
  }
}
