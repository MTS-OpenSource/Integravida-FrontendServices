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

  getById(id: string | number): string {
    return this.resourceUrl(id);
  }

  getByPatientId(from?: string, to?: string): string {
    const params = new URLSearchParams();

    if (from) {
      params.set('from', from);
    }

    if (to) {
      params.set('to', to);
    }

    const qs = params.toString();
    return qs ? `${this.collectionUrl()}?${qs}` : this.collectionUrl();
  }
}
