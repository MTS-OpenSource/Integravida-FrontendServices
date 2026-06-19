import { Injectable } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

const ALERTS_RESOURCE_PATH = '/alerts';
const LOCAL_MONITORING_API_BASE_URL = '/api/v1';

@Injectable({
  providedIn: 'root',
})
export class AlertApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(LOCAL_MONITORING_API_BASE_URL, ALERTS_RESOURCE_PATH);
  }

  getAll(): string {
    return this.collectionUrl();
  }

  getByPatientId(patientId: string | number, unreadOnly = false): string {
    const params = new URLSearchParams({
      patientId: String(patientId),
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
