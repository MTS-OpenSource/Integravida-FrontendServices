import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base.api.endpoint';

export class DoctorApiEndpoint extends BaseApiEndpoint {
  constructor() {
    super(
      environment.integravidaBackendApiBaseUrl,
      environment.integravidaBackendDoctorEndpointPath,
    );
  }

  myPatients(): string {
    return this.collectionUrl();
  }

  patientSummary(patientId: string): string {
    return `${this.resourceUrl(patientId)}/summary`;
  }

  patientGlucoseRecords(patientId: string): string {
    return `${this.resourceUrl(patientId)}/glucose-records`;
  }

  patientTreatments(patientId: string): string {
    return `${this.resourceUrl(patientId)}/treatments`;
  }

  patientMedications(patientId: string): string {
    return `${this.resourceUrl(patientId)}/medications`;
  }

  patientClinicalObservations(patientId: string): string {
    return `${this.resourceUrl(patientId)}/clinical-observations`;
  }

  patientDiagnoses(patientId: string): string {
    return `${this.resourceUrl(patientId)}/diagnoses`;
  }

  patientClinicalReports(patientId: string): string {
    return `${this.resourceUrl(patientId)}/clinical-reports`;
  }

  patientAppointments(patientId: string): string {
    return `${this.resourceUrl(patientId)}/appointments`;
  }
}
