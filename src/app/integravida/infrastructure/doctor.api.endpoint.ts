import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class DoctorApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderDoctorEndpointPath,
    );
  }

  getAll(): string {
    return this.collectionUrl();
  }
}
