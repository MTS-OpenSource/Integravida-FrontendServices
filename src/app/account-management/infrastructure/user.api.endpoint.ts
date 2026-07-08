import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

@Injectable({
  providedIn: 'root',
})
export class UserApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderUsersEndpointPath,
    );
  }

  signIn(): string {
    return `${this.collectionUrl()}/sign-in`;
  }

  signUp(): string {
    return `${this.collectionUrl()}/sign-up`;
  }

  getAll(): string {
    return this.collectionUrl();
  }

  getById(id: number): string {
    return this.resourceUrl(id);
  }
}
