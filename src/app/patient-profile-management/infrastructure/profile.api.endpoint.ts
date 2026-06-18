import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaBackendApiBaseUrl,
      environment.integravidaBackendProfilesEndpointPath,
    );
  }

  getById(profileId: string): string {
    return this.resourceUrl(profileId);
  }

  getByEmail(email: string): string {
    return `${this.baseUrl}?email=${encodeURIComponent(email)}`;
  }
}
