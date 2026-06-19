import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AppointmentEntity } from '../domain/model/appointment.entity';
import { AppointmentApiEndpoint } from './appointment.api.endpoint';
import { AppointmentAssembler } from './appointment.assembler';
import { AppointmentResponse } from './appointment.response';

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
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

  getAll(): Observable<AppointmentEntity[]> {
    return this.http
      .get<AppointmentResponse[]>(this.appointmentEndpoint.getAll())
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  getByPatientId(patientId: string): Observable<AppointmentEntity[]> {
    return this.http
      .get<AppointmentResponse[]>(this.appointmentEndpoint.getByPatientId(patientId))
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  create(appointment: CreateAppointmentPayload): Observable<AppointmentEntity> {
    return this.http
      .post<AppointmentResponse>(this.appointmentEndpoint.getAll(), appointment)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
