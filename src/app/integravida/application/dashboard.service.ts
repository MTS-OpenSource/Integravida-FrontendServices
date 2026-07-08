import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { AlertEntity } from '../domain/model/alert.entity';
import { AuthSession } from '../../account-management/domain/model/auth-session.model';
import { DashboardSummary } from '../domain/model/dashboard-summary.model';
import { GlucoseRecordEntity } from '../../glucose-monitoring/domain/model/glucose-record.entity';
import { MedicationEntity } from '../domain/model/medication.entity';
import { TreatmentEntity } from '../domain/model/treatment.entity';
import { AuthStore } from '../../account-management/application/auth.store';
import { AlertApi } from '../infrastructure/alert.api';
import { GlucoseRecordApi } from '../../glucose-monitoring/infrastructure/glucose-record.api';
import { MedicationApi } from '../infrastructure/medication.api';
import { TreatmentApi } from '../infrastructure/treatment.api';

import { MedicationIntakeApi } from '../infrastructure/medication-intake.api';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly summarySignal = signal<DashboardSummary | null>(null);
  readonly summary = this.summarySignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly hasSummary = computed(() => this.summary() !== null);

  private readonly confirmedMedicationIdsSignal = signal<Set<string>>(new Set());
  private readonly medicationIntakeLoadingIdsSignal = signal<Set<string>>(new Set());

  isMedicationConfirmed(medicationId: string): boolean {
    return this.confirmedMedicationIdsSignal().has(medicationId);
  }

  isMedicationIntakeLoading(medicationId: string): boolean {
    return this.medicationIntakeLoadingIdsSignal().has(medicationId);
  }

  confirmMedicationIntake(medication: MedicationEntity): void {
    const token = this.authStore.token();
    if (!token) return;

    if (this.isMedicationConfirmed(medication.id) || this.isMedicationIntakeLoading(medication.id)) {
      return;
    }

    this.addMedicationIntakeLoadingId(medication.id);
    this.errorSignal.set(null);

    this.medicationIntakeApi
      .confirmDose(token, medication.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.confirmedMedicationIdsSignal.update((ids) => {
            const updatedIds = new Set(ids);
            updatedIds.add(medication.id);
            return updatedIds;
          });

          this.removeMedicationIntakeLoadingId(medication.id);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to confirm medication intake'));
          this.removeMedicationIntakeLoadingId(medication.id);
        },
      });
  }

  private addMedicationIntakeLoadingId(medicationId: string): void {
    this.medicationIntakeLoadingIdsSignal.update((ids) => {
      const updatedIds = new Set(ids);
      updatedIds.add(medicationId);
      return updatedIds;
    });
  }

  private removeMedicationIntakeLoadingId(medicationId: string): void {
    this.medicationIntakeLoadingIdsSignal.update((ids) => {
      const updatedIds = new Set(ids);
      updatedIds.delete(medicationId);
      return updatedIds;
    });
  }

  constructor(
    private readonly authStore: AuthStore,
    private readonly treatmentApi: TreatmentApi,
    private readonly glucoseRecordApi: GlucoseRecordApi,
    private readonly medicationApi: MedicationApi,
    private readonly medicationIntakeApi: MedicationIntakeApi,
    private readonly alertApi: AlertApi,
  ) {
    effect(
      () => {
        const session = this.authStore.getCurrentSession();

        if (!session) {
          this.summarySignal.set(null);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
          return;
        }

        this.refresh(session);
      },
      { allowSignalWrites: true },
    );
  }

  reload(): void {
    const session = this.authStore.getCurrentSession();

    if (!session) {
      return;
    }

    this.refresh(session);
  }

  private refresh(session: AuthSession): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      treatments: this.treatmentApi.getAll(session.token),
      glucoseRecords: this.glucoseRecordApi.getAll(session.token),
      medications: this.medicationApi.getAll(session.token),
      alerts: this.alertApi.getAll(session.token),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ treatments, glucoseRecords, medications, alerts }) => {
          this.summarySignal.set(
            this.buildSummary(glucoseRecords, medications, alerts, treatments),
          );
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load dashboard summary'));
          this.loadingSignal.set(false);
        },
      });
  }

  private buildSummary(
    glucoseRecords: GlucoseRecordEntity[],
    medications: MedicationEntity[],
    alerts: AlertEntity[],
    treatments: TreatmentEntity[],
  ): DashboardSummary {
    const activeTreatmentIds = new Set(
      treatments
        .filter((treatment) => this.isTreatmentActive(treatment))
        .map((treatment) => treatment.id),
    );
    const activeMedications = medications
      .filter(
        (medication) =>
          medication.treatmentId !== null && activeTreatmentIds.has(medication.treatmentId),
      )
      .slice(0, 5);
    const unresolvedAlerts = alerts.filter((alert) => !alert.read);
    const criticalAlerts = unresolvedAlerts.filter((alert) => this.isAlertCritical(alert));
    const recentAlerts = [...unresolvedAlerts]
      .sort((left, right) => this.compareDatesDesc(left.createdAt, right.createdAt))
      .slice(0, 5);
    const latestGlucoseRecord =
      [...glucoseRecords].sort((left, right) =>
        this.compareDatesDesc(left.recordedAt, right.recordedAt),
      )[0] ?? null;
    const averageGlucoseLevel = this.calculateAverageGlucose(glucoseRecords);
    const { chartLabels, chartValues } = this.buildGlucoseChartData(glucoseRecords);
    const { inRangePercentage, lowEpisodes } =
      this.calculateGlucoseRanges(glucoseRecords);

    return {
      glucoseRecordsCount: glucoseRecords.length,
      latestGlucoseRecord,
      medicationsCount: medications.length,
      activeMedicationsCount: activeMedications.length,
      treatmentsCount: treatments.length,
      activeTreatmentsCount: activeTreatmentIds.size,
      alertsCount: alerts.length,
      unresolvedAlertsCount: unresolvedAlerts.length,
      criticalAlertsCount: criticalAlerts.length,
      averageGlucoseLevel,
      chartLabels,
      chartValues,
      inRangePercentage,
      lowEpisodes,
      recentAlerts,
      activeMedications,
    };
  }

  private buildGlucoseChartData(
    glucoseRecords: GlucoseRecordEntity[],
  ): { chartLabels: string[]; chartValues: number[] } {
    const now = new Date();
    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(dateStr);

      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
      const dayEnd = dayStart + 86_400_000;

      const dayRecords = glucoseRecords.filter((r) => {
        const ts = this.toTimestamp(r.recordedAt);
        return ts >= dayStart && ts < dayEnd;
      });

      const levels = dayRecords
        .map((r) => r.glucoseLevel)
        .filter((v): v is number => v !== null);

      const avg =
        levels.length > 0
          ? Number((levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1))
          : 0;

      values.push(avg);
    }

    return { chartLabels: labels, chartValues: values };
  }

  private isTreatmentActive(treatment: TreatmentEntity): boolean {
    if (treatment.status) {
      return treatment.status.toLowerCase() === 'active';
    }

    if (treatment.endDate) {
      return this.toTimestamp(treatment.endDate) >= Date.now();
    }

    return true;
  }

  private isAlertCritical(alert: AlertEntity): boolean {
    if (alert.glucoseValue !== null) {
      return alert.glucoseValue < 70;
    }

    if (!alert.severity) {
      return false;
    }

    return ['critical', 'high', 'urgent'].includes(alert.severity.toLowerCase());
  }

  private calculateAverageGlucose(glucoseRecords: GlucoseRecordEntity[]): number | null {
    const values = glucoseRecords
      .map((record) => record.glucoseLevel)
      .filter((value): value is number => value !== null);

    if (values.length === 0) {
      return null;
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    return Number((total / values.length).toFixed(2));
  }

  private calculateGlucoseRanges(
    glucoseRecords: GlucoseRecordEntity[],
  ): { inRangePercentage: number; lowEpisodes: number } {
    const levels = glucoseRecords
      .map((r) => r.glucoseLevel)
      .filter((v): v is number => v !== null);

    if (levels.length === 0) {
      return { inRangePercentage: 0, lowEpisodes: 0 };
    }

    const lowEpisodes = levels.filter((v) => v < 70).length;
    const inRangeCount = levels.filter((v) => v >= 70 && v <= 180).length;
    const inRangePercentage = Number(((inRangeCount / levels.length) * 100).toFixed(1));

    return { inRangePercentage, lowEpisodes };
  }

  private compareDatesDesc(left: string | null, right: string | null): number {
    return this.toTimestamp(right) - this.toTimestamp(left);
  }

  private toTimestamp(value: string | null): number {
    if (!value) {
      return 0;
    }

    const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);

    if (match) {
      const [, day, month, year, hour = '0', minute = '0'] = match;
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
      ).getTime();
    }

    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }
}
