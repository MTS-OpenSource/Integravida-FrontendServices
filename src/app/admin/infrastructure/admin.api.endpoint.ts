import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

export class AdminApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaBackendApiBaseUrl,
      environment.integravidaBackendAdminEndpointPath,
    );
  }

  dashboard(): string {
    return `${this.collectionUrl()}/dashboard`;
  }

  users(): string {
    return `${this.collectionUrl()}/users`;
  }

  doctors(): string {
    return `${this.collectionUrl()}/doctors`;
  }

  patients(): string {
    return `${this.collectionUrl()}/patients`;
  }

  assignments(): string {
    return `${this.collectionUrl()}/assignments`;
  }

  deleteAssignment(id: string): string {
    return `${this.assignments()}/${id}`;
  }
}
