import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AppointmentEntity } from '../domain/model/appointment.entity';
import { AppointmentApiEndpoint } from './appointment.api.endpoint';
import { AppointmentAssembler } from './appointment.assembler';
import { AppointmentResponse } from './appointment.response';

export interface CreateAppointmentPayload {
  scheduledAt: string;
  reason: string;
}

export interface UpdateAppointmentPayload {
  scheduledAt: string;
  reason: string;
}

/**
 * Handles HTTP communication with the real backend appointments API.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentApi {
  private readonly http = inject(HttpClient);
  private readonly assembler = new AppointmentAssembler();

  constructor(private readonly appointmentEndpoint: AppointmentApiEndpoint) {}

  getAll(token: string): Observable<AppointmentEntity[]> {
    return this.http
      .get<AppointmentResponse[]>(this.appointmentEndpoint.getAll(), {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  create(token: string, appointment: CreateAppointmentPayload): Observable<AppointmentEntity> {
    return this.http
      .post<AppointmentResponse>(this.appointmentEndpoint.getAll(), appointment, {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  update(
    token: string,
    id: string | number,
    appointment: UpdateAppointmentPayload,
  ): Observable<AppointmentEntity> {
    return this.http
      .put<AppointmentResponse>(this.appointmentEndpoint.getById(id), appointment, {
        headers: this.authHeaders(token),
      })
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  delete(token: string, id: string | number): Observable<void> {
    return this.http.delete<void>(this.appointmentEndpoint.getById(id), {
      headers: this.authHeaders(token),
    });
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
