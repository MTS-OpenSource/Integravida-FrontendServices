import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorApiEndpoint } from './doctor.api.endpoint';
import { AuthStore } from '../../account-management/application/auth.store';
import {
  PatientAssignment,
  PatientSummary,
  GlucoseRecord,
  Treatment,
  Medication,
  CreateTreatmentRequest,
  CreateMedicationRequest,
} from '../domain/model/doctor.models';

@Injectable({ providedIn: 'root' })
export class DoctorApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = new DoctorApiEndpoint();
  private readonly authStore = inject(AuthStore);

  private authHeaders(): HttpHeaders {
    const token = this.authStore.token();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getMyPatients(): Observable<PatientAssignment[]> {
    return this.http.get<PatientAssignment[]>(this.endpoint.myPatients(), {
      headers: this.authHeaders(),
    });
  }

  getPatientSummary(patientId: string): Observable<PatientSummary> {
    return this.http.get<PatientSummary>(this.endpoint.patientSummary(patientId), {
      headers: this.authHeaders(),
    });
  }

  getPatientGlucoseRecords(patientId: string): Observable<GlucoseRecord[]> {
    return this.http.get<GlucoseRecord[]>(this.endpoint.patientGlucoseRecords(patientId), {
      headers: this.authHeaders(),
    });
  }

  getPatientTreatments(patientId: string): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(this.endpoint.patientTreatments(patientId), {
      headers: this.authHeaders(),
    });
  }

  createTreatment(patientId: string, request: CreateTreatmentRequest): Observable<Treatment> {
    return this.http.post<Treatment>(this.endpoint.patientTreatments(patientId), request, {
      headers: this.authHeaders(),
    });
  }

  createMedication(patientId: string, request: CreateMedicationRequest): Observable<Medication> {
    return this.http.post<Medication>(this.endpoint.patientMedications(patientId), request, {
      headers: this.authHeaders(),
    });
  }
}
