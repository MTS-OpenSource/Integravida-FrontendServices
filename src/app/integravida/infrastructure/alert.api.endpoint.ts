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

  getByPatientId(unreadOnly = false): string {
    const params = new URLSearchParams({
      unreadOnly: String(unreadOnly),
    });
    return `${this.collectionUrl()}?${params.toString()}`;
  }

  getById(id: string | number): string {
    return `${this.collectionUrl()}/${id}`;
  }

  markAsRead(id: string | number): string {
    return `${this.getById(id)}/read`;
  }
}
