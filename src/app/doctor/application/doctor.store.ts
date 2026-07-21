import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DoctorApi,
} from '../infrastructure/doctor.api';
import {
  PatientAssignment,
  PatientSummary,
  GlucoseRecord,
  Treatment,
  CreateTreatmentRequest,
  CreateMedicationRequest,
} from '../domain/model/doctor.models';

@Injectable({ providedIn: 'root' })
export class DoctorStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly doctorApi = inject(DoctorApi);

  readonly patients = signal<PatientAssignment[]>([]);
  readonly selectedPatientSummary = signal<PatientSummary | null>(null);
  readonly selectedPatientGlucose = signal<GlucoseRecord[]>([]);
  readonly selectedPatientTreatments = signal<Treatment[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  loadMyPatients(): void {
    this.loading.set(true);
    this.doctorApi
      .getMyPatients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (patients) => {
          this.patients.set(patients);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load patients');
          this.loading.set(false);
        },
      });
  }

  loadPatientSummary(patientId: string): void {
    this.loading.set(true);
    this.doctorApi
      .getPatientSummary(patientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summary) => {
          this.selectedPatientSummary.set(summary);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load patient summary');
          this.loading.set(false);
        },
      });
  }

  loadPatientGlucoseRecords(patientId: string): void {
    this.loading.set(true);
    this.doctorApi
      .getPatientGlucoseRecords(patientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (records) => {
          this.selectedPatientGlucose.set(records);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load glucose records');
          this.loading.set(false);
        },
      });
  }

  loadPatientTreatments(patientId: string): void {
    this.loading.set(true);
    this.doctorApi
      .getPatientTreatments(patientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (treatments) => {
          this.selectedPatientTreatments.set(treatments);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load treatments');
          this.loading.set(false);
        },
      });
  }

  createTreatment(patientId: string, request: CreateTreatmentRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.doctorApi
      .createTreatment(patientId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadPatientTreatments(patientId);
          this.loadPatientSummary(patientId);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error || 'Failed to create treatment');
          this.loading.set(false);
        },
      });
  }

  createMedication(patientId: string, request: CreateMedicationRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.doctorApi
      .createMedication(patientId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadPatientTreatments(patientId);
          this.loadPatientSummary(patientId);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error || 'Failed to create medication');
          this.loading.set(false);
        },
      });
  }

  clearSelected(): void {
    this.selectedPatientSummary.set(null);
    this.selectedPatientGlucose.set([]);
    this.selectedPatientTreatments.set([]);
  }
}
