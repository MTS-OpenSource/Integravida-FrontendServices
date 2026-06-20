import { Routes } from '@angular/router';

import { PatientProfile } from './patient-profile/patient-profile';

// TODO: once authentication is connected to the real backend, replace this
// hardcoded default with the logged-in user's own profileId instead of
// redirecting to a fixed demo profile.
const DEFAULT_DEMO_PROFILE_ID = '2b5c07f3-c555-4d64-91ef-f4b53b04afe6';

export const PATIENT_PROFILE_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_DEMO_PROFILE_ID,
  },
  {
    path: ':profileId',
    component: PatientProfile,
  },
];
