import { Routes } from '@angular/router';

import { PatientProfile } from './patient-profile/patient-profile';

export const PATIENT_PROFILE_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '1',
  },
  {
    path: ':patientId',
    component: PatientProfile,
  },
];
