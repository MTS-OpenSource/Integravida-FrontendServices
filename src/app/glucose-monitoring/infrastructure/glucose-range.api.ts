import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { GlucoseRangeEntity } from '../domain/model/glucose-range.entity';
import { GlucoseRangeAssembler } from './glucose-range.assembler';
import { GlucoseRangeApiEndpoint } from './glucose-range.api.endpoint';
import { GlucoseRangeResponse } from './glucose-range.response';

@Injectable({
  providedIn: 'root',
})
export class GlucoseRangeApi {
  private readonly http = inject(HttpClient);
  private readonly assembler = new GlucoseRangeAssembler();

  constructor(private readonly glucoseRangeEndpoint: GlucoseRangeApiEndpoint) {}

  getAll(token: string): Observable<GlucoseRangeEntity | null> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<GlucoseRangeResponse | null>(this.glucoseRangeEndpoint.getAll(), { headers })
      .pipe(map((response) => (response ? this.assembler.toEntityFrom(response) : null)));
  }

  update(
    patientId: string | number,
    payload: { minimumValue: number; maximumValue: number },
  ): Observable<GlucoseRangeEntity> {
    return this.http
      .put<GlucoseRangeResponse>(this.glucoseRangeEndpoint.updateByPatientId(patientId), payload)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
