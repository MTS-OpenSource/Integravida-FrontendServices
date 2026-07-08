import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

/**
 * Defines the API endpoint URLs for the Appointment Management bounded context.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaBackendApiBaseUrl,
      environment.integravidaBackendAppointmentsEndpointPath,
    );
  }

  getAll(): string {
    return this.collectionUrl();
  }

  getById(id: string | number): string {
    return this.resourceUrl(id);
  }
}
