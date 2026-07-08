import { HttpHeaders } from '@angular/common/http';
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

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(token: string): Observable<AlertEntity[]> {
    return this.http
      .get<AlertResponse[]>(this.alertEndpoint.getAll(), { headers: this.authHeaders(token) })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  getByPatientId(token: string, unreadOnly = false): Observable<AlertEntity[]> {
    return this.http
      .get<AlertResponse[]>(this.alertEndpoint.getByPatientId(unreadOnly), { headers: this.authHeaders(token) })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  markAsRead(token: string, id: string | number): Observable<AlertEntity> {
    return this.http
      .patch<AlertResponse>(this.alertEndpoint.markAsRead(id), {}, { headers: this.authHeaders(token) })
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
  create(token: string, alert: Record<string, unknown>): void {
    this.http.post(this.alertEndpoint.getAll(), alert, { headers: this.authHeaders(token) }).subscribe();
  }
}
