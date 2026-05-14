import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { AlertEntity } from '../domain/model/alert.entity';
import { AuthSession } from '../domain/model/auth-session.model';
import { DashboardSummary } from '../domain/model/dashboard-summary.model';
import { DoctorEntity } from '../domain/model/doctor.entity';
import { GlucoseRecordEntity } from '../domain/model/glucose-record.entity';
import { MedicationEntity } from '../domain/model/medication.entity';
import { PatientEntity } from '../domain/model/patient.entity';
import { TreatmentEntity } from '../domain/model/treatment.entity';
import { AuthStore } from './auth.store';
import { AlertApi } from '../infrastucture/alert.api';
import { DoctorApi } from '../infrastucture/doctor.api';
import { GlucoseRecordApi } from '../infrastucture/glucose-record.api';
import { MedicationApi } from '../infrastucture/medication.api';
import { PatientApi } from '../infrastucture/patient.api';
import { PatientDoctorApi } from '../infrastucture/patient-doctor.api';
import { PatientDoctorResponse } from '../infrastucture/patient-doctor.response';
import { TreatmentApi } from '../infrastucture/treatment.api';

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

  constructor(
    private readonly authStore: AuthStore,
    private readonly patientApi: PatientApi,
    private readonly doctorApi: DoctorApi,
    private readonly patientDoctorApi: PatientDoctorApi,
    private readonly treatmentApi: TreatmentApi,
    private readonly glucoseRecordApi: GlucoseRecordApi,
    private readonly medicationApi: MedicationApi,
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
      patients: this.patientApi.getAll(),
      doctors: this.doctorApi.getAll(),
      patientDoctorLinks: this.patientDoctorApi.getAll(),
      treatments: this.treatmentApi.getAll(),
      glucoseRecords: this.glucoseRecordApi.getAll(),
      medications: this.medicationApi.getAll(),
      alerts: this.alertApi.getAll(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({
          patients,
          doctors,
          patientDoctorLinks,
          treatments,
          glucoseRecords,
          medications,
          alerts,
        }) => {
          const patientIds = this.resolvePatientIdsForSession(
            session,
            patients,
            doctors,
            patientDoctorLinks,
          );
          const doctorIds = this.resolveDoctorIdsForSession(session, doctors);
          const scopedTreatments = this.filterTreatments(treatments, patientIds, doctorIds);
          const scopedMedications = this.filterMedications(medications, scopedTreatments);
          const scopedGlucoseRecords = glucoseRecords.filter(
            (record) => record.patientId !== null && patientIds.has(record.patientId),
          );
          const scopedAlerts = alerts.filter(
            (alert) => alert.patientId !== null && patientIds.has(alert.patientId),
          );

          this.summarySignal.set(
            this.buildSummary(
              scopedGlucoseRecords,
              scopedMedications,
              scopedAlerts,
              scopedTreatments,
            ),
          );
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load dashboard summary'));
          this.loadingSignal.set(false);
        },
      });
  }

  private resolvePatientIdsForSession(
    session: AuthSession,
    patients: PatientEntity[],
    doctors: DoctorEntity[],
    patientDoctorLinks: PatientDoctorResponse[],
  ): Set<number> {
    if (session.user.role === 'Patient') {
      const patient = patients.find((item) => item.userId === session.user.id);
      return patient ? new Set([patient.id]) : new Set<number>();
    }

    const doctor = doctors.find((item) => item.userId === session.user.id);

    if (!doctor) {
      return new Set<number>();
    }

    return new Set(
      patientDoctorLinks
        .filter((link) => this.readDoctorId(link) === doctor.id)
        .map((link) => this.readPatientId(link))
        .filter((patientId): patientId is number => patientId !== null),
    );
  }

  private resolveDoctorIdsForSession(session: AuthSession, doctors: DoctorEntity[]): Set<number> {
    if (session.user.role !== 'Doctor') {
      return new Set<number>();
    }

    const doctor = doctors.find((item) => item.userId === session.user.id);
    return doctor ? new Set([doctor.id]) : new Set<number>();
  }

  private filterTreatments(
    treatments: TreatmentEntity[],
    patientIds: Set<number>,
    doctorIds: Set<number>,
  ): TreatmentEntity[] {
    return treatments.filter((treatment) => {
      const matchesPatient = treatment.patientId !== null && patientIds.has(treatment.patientId);
      const matchesDoctor = treatment.doctorId !== null && doctorIds.has(treatment.doctorId);
      return matchesPatient || matchesDoctor;
    });
  }

  private filterMedications(
    medications: MedicationEntity[],
    treatments: TreatmentEntity[],
  ): MedicationEntity[] {
    const treatmentIds = new Set(treatments.map((treatment) => treatment.id));
    return medications.filter(
      (medication) => medication.treatmentId !== null && treatmentIds.has(medication.treatmentId),
    );
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
    const recentAlerts = [...alerts]
      .sort((left, right) => this.compareDatesDesc(left.createdAt, right.createdAt))
      .slice(0, 5);
    const latestGlucoseRecord =
      [...glucoseRecords].sort((left, right) =>
        this.compareDatesDesc(left.recordedAt, right.recordedAt),
      )[0] ?? null;
    const averageGlucoseLevel = this.calculateAverageGlucose(glucoseRecords);

    return {
      glucoseRecordsCount: glucoseRecords.length,
      latestGlucoseRecord,
      medicationsCount: medications.length,
      activeMedicationsCount: activeMedications.length,
      alertsCount: alerts.length,
      unresolvedAlertsCount: unresolvedAlerts.length,
      criticalAlertsCount: criticalAlerts.length,
      averageGlucoseLevel,
      recentAlerts,
      activeMedications,
    };
  }

  private readPatientId(link: PatientDoctorResponse): number | null {
    const value = link.patientID ?? link.patientId ?? link.patient_id;
    return typeof value === 'number' ? value : null;
  }

  private readDoctorId(link: PatientDoctorResponse): number | null {
    const value = link.doctorID ?? link.doctorId ?? link.doctor_id;
    return typeof value === 'number' ? value : null;
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
