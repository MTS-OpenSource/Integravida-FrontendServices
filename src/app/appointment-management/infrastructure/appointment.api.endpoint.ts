import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';
/**
 * Defines the API endpoint URLs for the Appointment Management bounded context.
 *
 * This class centralizes the construction of URLs related to appointments,
 * following the same structure used in the other bounded contexts.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentApiEndpoint extends BaseApiEndpoint {
  /**
   * Creates the appointment API endpoint using the base URL and endpoint path
   * defined in the environment configuration.
   */
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderAppointmentsEndpointPath,
    );
  }

  /**
   * Gets the URL for the appointments collection.
   *
   * Example:
   * https://integravida-data.onrender.com/appointments
   *
   * @returns The appointments collection URL.
   */
  getAll(): string {
    return this.collectionUrl();
  }

  /**
   * Gets the URL for appointments filtered by patient ID.
   *
   * Example:
   * https://integravida-data.onrender.com/appointments?patient_id=1
   *
   * @param patientId Patient identifier used to filter appointments.
   * @returns The appointments URL filtered by patient.
   */
  getByPatientId(patientId: number): string {
    const params = new URLSearchParams({ patient_id: String(patientId) });
    return `${this.collectionUrl()}?${params.toString()}`;
  }
}
