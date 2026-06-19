import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base.api';
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

  getByPatientId(patientId: string | number, unreadOnly = false): Observable<AlertEntity[]> {
    return this.http
      .get<AlertResponse[]>(this.alertEndpoint.getByPatientId(patientId, unreadOnly))
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  markAsRead(id: string | number): Observable<AlertEntity> {
    return this.http
      .patch<AlertResponse>(this.alertEndpoint.markAsRead(id), {})
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
  create(alert: Record<string, unknown>): void {
    this.http.post(this.alertEndpoint.getAll(), alert).subscribe();
  }
}
