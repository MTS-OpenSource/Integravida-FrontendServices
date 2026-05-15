import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApi } from '../../shared/infrastucture/base.api';
import { AppointmentEntity } from '../domain/model/appointment.entity';
import { AppointmentApiEndpoint } from './appointment.api.endpoint';
import { AppointmentAssembler } from './appointment.assembler';
import { AppointmentResponse } from './appointment.response';

/**
 * Handles HTTP communication with the appointments API endpoint.
 *
 * This class belongs to the infrastructure layer because it is responsible
 * for accessing external data and converting API responses into domain entities.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentApi extends BaseApi<AppointmentEntity, AppointmentResponse> {
  /**
   * Creates the AppointmentApi instance.
   *
   * @param appointmentEndpoint Endpoint class used to build appointment API URLs.
   */
  constructor(private readonly appointmentEndpoint: AppointmentApiEndpoint) {
    super(appointmentEndpoint, new AppointmentAssembler());
  }

  /**
   * Gets all appointments from the API.
   *
   * @returns An observable list of appointment entities.
   */
  getAll(): Observable<AppointmentEntity[]> {
    return this.getAllFrom(this.appointmentEndpoint.getAll());
  }

  /**
   * Gets appointments filtered by patient identifier.
   *
   * @param patientId Patient identifier used to filter appointments.
   * @returns An observable list of appointment entities related to the patient.
   */
  getByPatientId(patientId: number): Observable<AppointmentEntity[]> {
    return this.http
      .get<AppointmentResponse[]>(this.appointmentEndpoint.getByPatientId(patientId))
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  /**
   * Creates a new appointment in the API.
   *
   * @param appointment Appointment data to be sent to the API.
   * @returns An observable appointment entity created from the API response.
   */
  create(appointment: AppointmentResponse): Observable<AppointmentEntity> {
    return this.http
      .post<AppointmentResponse>(this.appointmentEndpoint.getAll(), appointment)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
