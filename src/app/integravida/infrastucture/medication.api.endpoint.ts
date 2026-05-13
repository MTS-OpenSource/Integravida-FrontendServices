import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastucture/base.api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class MedicationApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderMedicationsEndpointPath,
    );
  }

  getAll(): string {
    return this.collectionUrl();
  }
}
