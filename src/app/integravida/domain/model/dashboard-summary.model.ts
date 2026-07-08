import { AlertEntity } from './alert.entity';
import { GlucoseRecordEntity } from '../../../glucose-monitoring/domain/model/glucose-record.entity';
import { MedicationEntity } from './medication.entity';

export interface DashboardSummary {
  glucoseRecordsCount: number;
  latestGlucoseRecord: GlucoseRecordEntity | null;
  medicationsCount: number;
  activeMedicationsCount: number;
  treatmentsCount: number;
  activeTreatmentsCount: number;
  alertsCount: number;
  unresolvedAlertsCount: number;
  criticalAlertsCount: number;
  averageGlucoseLevel: number | null;
  chartLabels: string[];
  chartValues: number[];
  inRangePercentage: number;
  lowEpisodes: number;
  recentAlerts: AlertEntity[];
  activeMedications: MedicationEntity[];
}
