import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PatientDoctorApiEndpoint } from './patient-doctor.api.endpoint';
import { PatientDoctorResponse } from './patient-doctor.response';

@Injectable({
  providedIn: 'root',
})
export class PatientDoctorApi {
  constructor(
    private readonly http: HttpClient,
    private readonly patientDoctorEndpoint: PatientDoctorApiEndpoint,
  ) {}

  getAll(): Observable<PatientDoctorResponse[]> {
    return this.http.get<PatientDoctorResponse[]>(this.patientDoctorEndpoint.getAll());
  }
}
