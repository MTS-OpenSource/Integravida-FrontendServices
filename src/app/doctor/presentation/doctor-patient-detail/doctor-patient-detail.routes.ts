import { Routes } from '@angular/router';

export const DOCTOR_PATIENT_DETAIL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./doctor-patient-detail').then((m) => m.DoctorPatientDetail),
  },
];
