import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base.api';
import { AdverseEffectEntity } from '../domain/model/adverse-effect.entity';
import { AdverseEffectApiEndpoint } from './adverse-effect.api.endpoint';
import { AdverseEffectAssembler } from './adverse-effect.assembler';
import { AdverseEffectResponse } from './adverse-effect.response';

export interface CreateAdverseEffectPayload {
  patientId: number;
  medicationId: number;
  description: string;
  severity: string;
  occurredAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdverseEffectApi extends BaseApi<AdverseEffectEntity, AdverseEffectResponse> {
  constructor(private readonly adverseEffectEndpoint: AdverseEffectApiEndpoint) {
    super(adverseEffectEndpoint, new AdverseEffectAssembler());
  }

  getAll(): Observable<AdverseEffectEntity[]> {
    return this.getAllFrom(this.adverseEffectEndpoint.getAll());
  }

  getByPatientId(patientId: number): Observable<AdverseEffectEntity[]> {
    return this.http
      .get<AdverseEffectResponse[]>(this.adverseEffectEndpoint.getByPatientId(patientId))
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  create(payload: CreateAdverseEffectPayload): Observable<AdverseEffectEntity> {
    const now = new Date().toISOString();

    const request = {
      patient_id: payload.patientId,
      patientID: payload.patientId,
      patientId: payload.patientId,
      medication_id: payload.medicationId,
      medicationID: payload.medicationId,
      medicationId: payload.medicationId,
      description: payload.description,
      severity: payload.severity,
      occurred_at: payload.occurredAt,
      occurredAt: payload.occurredAt,
      reported_at: now,
      reportedAt: now,
      status: 'reported',
    };

    return this.http
      .post<AdverseEffectResponse>(this.adverseEffectEndpoint.getAll(), request)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
