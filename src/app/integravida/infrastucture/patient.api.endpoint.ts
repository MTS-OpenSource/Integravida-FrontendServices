import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastucture/base.api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class PatientApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderPatientsEndpointPath,
    );
  }

  getAll(): string {
    return this.collectionUrl();
  }
}
