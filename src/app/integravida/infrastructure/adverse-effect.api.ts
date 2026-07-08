import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base.api';
import { AdverseEffectEntity } from '../domain/model/adverse-effect.entity';
import { AdverseEffectApiEndpoint } from './adverse-effect.api.endpoint';
import { AdverseEffectAssembler } from './adverse-effect.assembler';
import { AdverseEffectResponse } from './adverse-effect.response';

export interface CreateAdverseEffectPayload {
  medicationId: string;
  takenAt: string;
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdverseEffectApi extends BaseApi<AdverseEffectEntity, AdverseEffectResponse> {
  constructor(private readonly adverseEffectEndpoint: AdverseEffectApiEndpoint) {
    super(adverseEffectEndpoint, new AdverseEffectAssembler());
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(token: string): Observable<AdverseEffectEntity[]> {
    return this.http
      .get<AdverseEffectResponse[]>(this.adverseEffectEndpoint.getAll(), {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  getByPatientId(token: string): Observable<AdverseEffectEntity[]> {
    return this.http
      .get<AdverseEffectResponse[]>(this.adverseEffectEndpoint.getByPatientId(), {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  create(token: string, payload: CreateAdverseEffectPayload): Observable<AdverseEffectEntity> {
    const request = {
      medicationId: payload.medicationId,
      takenAt: payload.takenAt,
      notes: payload.notes,
    };

    return this.http
      .post<AdverseEffectResponse>(this.adverseEffectEndpoint.getAll(), request, {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
