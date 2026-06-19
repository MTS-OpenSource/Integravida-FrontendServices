import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, tap } from 'rxjs';
import { AlertApi } from '../../integravida/infrastructure/alert.api';

import { GlucoseRecordApi } from '../infrastructure/glucose-record.api';
import { GlucoseRecordEntity } from '../domain/model/glucose-record.entity';
import { GlucoseRangeApi } from '../infrastructure/glucose-range.api';
import { GlucoseRangeEntity } from '../domain/model/glucose-range.entity';

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

  private readonly rangeSignal = signal<GlucoseRange>(DEFAULT_RANGE);
  readonly range = this.rangeSignal.asReadonly();

  constructor(
    private readonly glucoseRecordApi: GlucoseRecordApi,
    private readonly glucoseRangeApi: GlucoseRangeApi,
    private readonly alertApi: AlertApi,
  ) {}

  getReadings(patientId: string | number): void {
    const normalizedPatientId = String(patientId).trim();

    if (!normalizedPatientId) {
      this.recordsSignal.set([]);
      this.errorSignal.set('Debes ingresar un patientId UUID para consultar lecturas.');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.glucoseRecordApi
      .getByPatientId(normalizedPatientId)
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

  getReadingsByDateRange(patientId: string | number, from: Date, to: Date): void {
    const normalizedPatientId = String(patientId).trim();

    if (!normalizedPatientId) {
      this.recordsSignal.set([]);
      this.errorSignal.set('Debes ingresar un patientId UUID para filtrar lecturas.');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const fromParam = this.formatDateTimeForApi(from);
    const toParam = this.formatDateTimeForApi(to, true);

    this.glucoseRecordApi
      .getByPatientId(normalizedPatientId, fromParam, toParam)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (records) => {
          this.recordsSignal.set(this.sortByDateDesc(records));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to filter glucose records'));
          this.loadingSignal.set(false);
        },
      });
  }

  saveReading(record: GlucoseRecordEntity): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.glucoseRecordApi
      .create(record)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdRecord) => {
          this.recordsSignal.update((records) => this.sortByDateDesc([...records, createdRecord]));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to save glucose record'));
          this.loadingSignal.set(false);
        },
      });
  }

  updateReading(id: string | number, record: GlucoseRecordEntity): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.glucoseRecordApi
      .update(id, record)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedRecord) => {
          this.recordsSignal.update((records) =>
            this.sortByDateDesc(
              records.map((currentRecord) =>
                currentRecord.id === id ? updatedRecord : currentRecord,
              ),
            ),
          );

          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to update glucose record'));
          this.loadingSignal.set(false);
        },
      });
  }

  deleteReading(id: string | number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.glucoseRecordApi
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.recordsSignal.update((records) => records.filter((record) => record.id !== id));

          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to delete glucose record'));
          this.loadingSignal.set(false);
        },
      });
  }

  loadRange(patientId: string | number) {
    const normalizedPatientId = String(patientId).trim();

    if (!normalizedPatientId) {
      this.errorSignal.set('Debes ingresar un patientId UUID para cargar el rango.');
      return of(null);
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.glucoseRangeApi
      .getByPatientId(normalizedPatientId)
      .pipe(
        tap((range) => {
          if (!range || range.minimumValue === null || range.maximumValue === null) {
            this.rangeSignal.set(DEFAULT_RANGE);
            return;
          }

          this.rangeSignal.set({
            min: range.minimumValue,
            max: range.maximumValue,
          });
        }),
        finalize(() => {
          this.loadingSignal.set(false);
        }),
        catchError((error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load glucose range'));
          return of(null);
        }),
      );
  }

  updateRange(patientId: string | number, min: number, max: number) {
    const normalizedPatientId = String(patientId).trim();

    if (!normalizedPatientId) {
      this.errorSignal.set('Debes ingresar un patientId UUID para guardar el rango.');
      return of(null as GlucoseRangeEntity | null);
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.glucoseRangeApi
      .update(normalizedPatientId, {
        minimumValue: min,
        maximumValue: max,
      })
      .pipe(
        tap((range) => {
          if (!range || range.minimumValue === null || range.maximumValue === null) return;

          this.rangeSignal.set({
            min: range.minimumValue,
            max: range.maximumValue,
          });
        }),
        finalize(() => {
          this.loadingSignal.set(false);
        }),
        catchError((error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to save glucose range'));
          return of(null as GlucoseRangeEntity | null);
        }),
      );
  }

  resetRange(): void {
    this.rangeSignal.set(DEFAULT_RANGE);
  }

  isValidRange(min: number, max: number): boolean {
    return Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > min;
  }

  evaluateRange(glucoseValue: number, range?: GlucoseRange): GlucoseStatus {
    const currentRange = range ?? this.rangeSignal();

    if (glucoseValue < currentRange.min) return 'Bajo';
    if (glucoseValue > currentRange.max) return 'Alto';
    return 'Normal';
  }

  private createAlertFromReading(record: GlucoseRecordEntity, status: GlucoseStatus): void {
    this.alertApi.create({
      patientID: record.patientId,
      type: status === 'Alto' ? 'Glucosa alta' : 'Glucosa baja',
      glucoseValue: record.glucoseValue,
      severity: status === 'Alto' ? 'High' : 'Low',
      createdAt: record.measuredAt,
      read: false,
    });
  }

  private sortByDateDesc(records: GlucoseRecordEntity[]): GlucoseRecordEntity[] {
    return [...records].sort((a, b) => {
      const dateA = a.measuredAt ? new Date(a.measuredAt).getTime() : 0;
      const dateB = b.measuredAt ? new Date(b.measuredAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  private formatDateTimeForApi(date: Date, endOfDay = false): string {
    const normalized = new Date(date);

    if (endOfDay) {
      normalized.setHours(23, 59, 59, 999);
    } else {
      normalized.setHours(0, 0, 0, 0);
    }

    const pad = (value: number): string => String(value).padStart(2, '0');

    return [
      normalized.getFullYear(),
      pad(normalized.getMonth() + 1),
      pad(normalized.getDate()),
    ].join('-') + `T${pad(normalized.getHours())}:${pad(normalized.getMinutes())}:${pad(normalized.getSeconds())}`;
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
