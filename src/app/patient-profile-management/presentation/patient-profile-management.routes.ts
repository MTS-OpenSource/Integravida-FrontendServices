import { Routes } from '@angular/router';

import { PatientProfile } from './patient-profile/patient-profile';

// TODO: once authentication is connected to the real backend, replace this
// hardcoded default with the logged-in user's own profileId instead of
// redirecting to a fixed demo profile.
const DEFAULT_DEMO_PROFILE_ID = 'ae9d2023-c5c1-4527-bf0f-82a551de1d38';

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
