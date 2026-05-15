import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApi } from '../../shared/infrastucture/base.api';
import { AlertEntity } from '../domain/model/alert.entity';
import { AlertApiEndpoint } from './alert.api.endpoint';
import { AlertAssembler } from './alert.assembler';
import { AlertResponse } from './alert.response';

@Injectable({
  providedIn: 'root',
})
export class AlertApi extends BaseApi<AlertEntity, AlertResponse> {
  constructor(private readonly alertEndpoint: AlertApiEndpoint) {
    super(alertEndpoint, new AlertAssembler());
  }

  getAll(): Observable<AlertEntity[]> {
    return this.getAllFrom(this.alertEndpoint.getAll());
  }

  getByPatientId(patientId: number): Observable<AlertEntity[]> {
    return this.http
      .get<AlertResponse[]>(this.alertEndpoint.getByPatientId(patientId))
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  markAsRead(id: number, alert: AlertEntity): Observable<AlertEntity> {
    return this.http
      .patch<AlertResponse>(this.alertEndpoint.getById(id), {
        ...alert.raw,
        read: true,
      })
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
