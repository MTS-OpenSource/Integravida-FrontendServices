import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class AlertApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderAlertsEndpointPath,
    );
  }

  getAll(): string {
    return this.collectionUrl();
  }

  getByPatientId(patientId: number): string {
    const params = new URLSearchParams({ patientID: String(patientId) });
    return `${this.collectionUrl()}?${params.toString()}`;
  }

  getById(id: number): string {
    return `${this.collectionUrl()}/${id}`;
  }
}
