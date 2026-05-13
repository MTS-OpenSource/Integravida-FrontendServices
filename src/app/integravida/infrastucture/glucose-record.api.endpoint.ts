import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastucture/base.api.endpoint';

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
}
