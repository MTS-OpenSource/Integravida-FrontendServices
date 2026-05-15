import { Routes } from '@angular/router';

import { GlucoseRecordList } from './glucose-record-list/glucose-record-list';

export const GLUCOSE_MONITORING_ROUTES: Routes = [
  {
    path: '',
    component: GlucoseRecordList,
  },
];
