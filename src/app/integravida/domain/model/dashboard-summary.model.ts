import { AlertEntity } from './alert.entity';
import { GlucoseRecordEntity } from './glucose-record.entity';
import { MedicationEntity } from './medication.entity';

export interface DashboardSummary {
  glucoseRecordsCount: number;
  latestGlucoseRecord: GlucoseRecordEntity | null;
  medicationsCount: number;
  activeMedicationsCount: number;
  alertsCount: number;
  unresolvedAlertsCount: number;
  criticalAlertsCount: number;
  averageGlucoseLevel: number | null;
  recentAlerts: AlertEntity[];
  activeMedications: MedicationEntity[];
}
