import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { TreatmentEntity } from '../domain/model/treatment.entity';
import { TreatmentApiEndpoint } from './treatment.api.endpoint';
import { TreatmentAssembler } from './treatment.assembler';
import { TreatmentResponse } from './treatment.response';

@Injectable({
  providedIn: 'root',
})
export class TreatmentApi {
  private readonly http = inject(HttpClient);
  private readonly assembler = new TreatmentAssembler();

  constructor(private readonly endpoint: TreatmentApiEndpoint) {}

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(token: string): Observable<TreatmentEntity[]> {
    return this.http
      .get<TreatmentResponse[]>(this.endpoint.getAll(), {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }
}
