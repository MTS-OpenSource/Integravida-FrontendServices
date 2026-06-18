import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class GlucoseRecordApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderGlucoseRecordsEndpointPath,
    );
  }

  getAll(): string {
    return this.collectionUrl();
  }

  getByPatientId(patientId: number, from?: string, to?: string): string {
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
