import { Routes } from '@angular/router';

export const DOCTOR_PATIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./doctor-patients').then((m) => m.DoctorPatients),
  },
];
