import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

@Injectable({
  providedIn: 'root'
})
export class UserApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaProviderApiBaseUrl,
      environment.integravidaProviderUsersEndpointPath
    );
  }

  getAll(): string {
    return this.collectionUrl();
  }

  getById(id: number): string {
    return this.resourceUrl(id);
  }

  getByEmailAndPassword(email: string, password: string): string {
    const params = new URLSearchParams({ emil: email, password });
    return `${this.collectionUrl()}?${params.toString()}`;
  }

  getByUsernameAndPassword(username: string, password: string): string {
    const params = new URLSearchParams({ username, password });
    return `${this.collectionUrl()}?${params.toString()}`;
  }

  getByEmail(email: string): string {
    const params = new URLSearchParams({ emil: email });
    return `${this.collectionUrl()}?${params.toString()}`;
  }
}
