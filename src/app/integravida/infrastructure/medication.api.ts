import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { MedicationEntity } from '../domain/model/medication.entity';
import { MedicationApiEndpoint } from './medication.api.endpoint';
import { MedicationAssembler } from './medication.assembler';
import { MedicationResponse } from './medication.response';

@Injectable({
  providedIn: 'root',
})
export class MedicationApi {
  private readonly http = inject(HttpClient);
  private readonly assembler = new MedicationAssembler();

  constructor(private readonly endpoint: MedicationApiEndpoint) {}

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(token: string): Observable<MedicationEntity[]> {
    return this.http
      .get<MedicationResponse[]>(this.endpoint.getAll(), {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  getByTreatmentId(treatmentId: string, token: string): Observable<MedicationEntity[]> {
    return this.http
      .get<MedicationResponse[]>(this.endpoint.getByTreatmentId(treatmentId), {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }
}
