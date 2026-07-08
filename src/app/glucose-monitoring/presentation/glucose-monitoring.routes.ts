import { Routes } from '@angular/router';
import { GlucoseLog } from './glucose-log/glucose-log';

export const GLUCOSE_MONITORING_ROUTES: Routes = [
  {
    path: '',
    component: GlucoseLog,
  },
];
