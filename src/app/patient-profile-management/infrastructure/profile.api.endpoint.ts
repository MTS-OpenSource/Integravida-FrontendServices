import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaBackendProfilesEndpointPath,
    );
  }

  getById(profileId: string): string {
    return this.resourceUrl(profileId);
  }

  getAll(): string {
    return this.collectionUrl();
  }

  getByEmail(email: string): string {
    return `${this.collectionUrl()}?email=${encodeURIComponent(email)}`;
  }
}
