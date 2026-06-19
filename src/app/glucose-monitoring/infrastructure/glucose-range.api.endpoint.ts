import { Injectable } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

const GLUCOSE_RANGES_RESOURCE_PATH = '/glucose-ranges';
const LOCAL_MONITORING_API_BASE_URL = '/api/v1';

@Injectable({
  providedIn: 'root',
})
export class GlucoseRangeApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(LOCAL_MONITORING_API_BASE_URL, GLUCOSE_RANGES_RESOURCE_PATH);
  }

  getByPatientId(patientId: string | number): string {
    return this.resourceUrl(patientId);
  }

  updateByPatientId(patientId: string | number): string {
    return this.resourceUrl(patientId);
  }
}
