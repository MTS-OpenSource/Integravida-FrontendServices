import { Routes } from '@angular/router';
import { GlucoseHistory } from './glucose-history/glucose-history';

export const GLUCOSE_MONITORING_ROUTES: Routes = [
  {
    path: '',
    component: GlucoseHistory,
  },
];
