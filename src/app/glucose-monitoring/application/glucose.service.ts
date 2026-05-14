import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GlucoseRecordApi } from '../infrastructure/glucose-record.api';
import { GlucoseRecordEntity } from '../domain/model/glucose-record.entity';

export type GlucoseStatus = 'Normal' | 'Alto' | 'Bajo';

export interface GlucoseRange {
  min: number;
  max: number;
}

const DEFAULT_RANGE: GlucoseRange = { min: 70, max: 180 };

@Injectable({
  providedIn: 'root',
})
export class GlucoseService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly recordsSignal = signal<GlucoseRecordEntity[]>([]);
  readonly records = this.recordsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private readonly glucoseRecordApi: GlucoseRecordApi) {}

  getReadings(patientId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.glucoseRecordApi
      .getByPatientId(patientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (records) => {
          this.recordsSignal.set(this.sortByDateDesc(records));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load glucose records'));
          this.loadingSignal.set(false);
        },
      });
  }

  getReadingsByDateRange(patientId: number, from: Date, to: Date): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.glucoseRecordApi
      .getByPatientId(patientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (records) => {
          const filtered = records.filter((record) => {
            if (!record.recordedAt) return false;
            const date = new Date(record.recordedAt);
            return date >= from && date <= to;
          });
          this.recordsSignal.set(this.sortByDateDesc(filtered));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to filter glucose records'));
          this.loadingSignal.set(false);
        },
      });
  }

  evaluateRange(glucoseValue: number, range: GlucoseRange = DEFAULT_RANGE): GlucoseStatus {
    if (glucoseValue < range.min) return 'Bajo';
    if (glucoseValue > range.max) return 'Alto';
    return 'Normal';
  }

  private sortByDateDesc(records: GlucoseRecordEntity[]): GlucoseRecordEntity[] {
    return [...records].sort((a, b) => {
      const dateA = a.recordedAt ? new Date(a.recordedAt).getTime() : 0;
      const dateB = b.recordedAt ? new Date(b.recordedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
