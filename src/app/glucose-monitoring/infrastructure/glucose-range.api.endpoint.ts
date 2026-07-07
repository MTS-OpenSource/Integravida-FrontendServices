import { Injectable } from '@angular/core';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlucoseRangeApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderGlucoseRangesEndpointPath,
    );
  }

  getByPatientId(patientId: string | number): string {
    return this.resourceUrl(patientId);
  }

  updateByPatientId(patientId: string | number): string {
    return this.resourceUrl(patientId);
  }
}
