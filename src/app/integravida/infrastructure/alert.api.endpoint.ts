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

  getByPatientId(patientId: number, unreadOnly = false): string {
    const params = new URLSearchParams({
      patientId: String(patientId),
      unreadOnly: String(unreadOnly),
    });
    return `${this.collectionUrl()}?${params.toString()}`;
  }

  getById(id: number): string {
    return `${this.collectionUrl()}/${id}`;
  }

  markAsRead(id: number): string {
    return `${this.resourceUrl(id)}/read`;
  }
}
