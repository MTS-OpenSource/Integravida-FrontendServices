import { Injectable } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

const GLUCOSE_RECORDS_RESOURCE_PATH = '/glucose-records';
const LOCAL_MONITORING_API_BASE_URL = '/api/v1';

@Injectable({
  providedIn: 'root',
})
export class GlucoseRecordApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      LOCAL_MONITORING_API_BASE_URL,
      GLUCOSE_RECORDS_RESOURCE_PATH,
    );
  }

  getAll(): string {
    return this.collectionUrl();
  }

  getById(id: string | number): string {
    return this.resourceUrl(id);
  }

  getByPatientId(patientId: string | number, from?: string, to?: string): string {
    const params = new URLSearchParams({ patientId: String(patientId) });

    if (from) {
      params.set('from', from);
    }

    if (to) {
      params.set('to', to);
    }

    return `${this.collectionUrl()}?${params.toString()}`;
  }
}
