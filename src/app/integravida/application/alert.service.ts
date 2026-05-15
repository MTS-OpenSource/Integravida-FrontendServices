import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AlertApi } from '../infrastucture/alert.api';
import { AlertEntity } from '../domain/model/alert.entity';

export type AlertTab = 'Todas' | 'Activas' | 'Resueltas';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly alertApi = inject(AlertApi);

  private readonly alertsSignal = signal<AlertEntity[]>([]);
  readonly alerts = this.alertsSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly activeAlerts = computed(() => this.alertsSignal().filter((alert) => !alert.read));

  readonly resolvedAlerts = computed(() => this.alertsSignal().filter((alert) => alert.read));

  getAlerts(patientId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.alertApi
      .getByPatientId(patientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (alerts) => {
          this.alertsSignal.set(this.sortByDateDesc(alerts));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load alerts'));
          this.loadingSignal.set(false);
        },
      });
  }

  markAsRead(alert: AlertEntity): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.alertApi
      .markAsRead(alert.id, alert)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedAlert) => {
          this.alertsSignal.update((alerts) =>
            alerts.map((currentAlert) =>
              currentAlert.id === updatedAlert.id ? updatedAlert : currentAlert,
            ),
          );
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to mark alert as read'));
          this.loadingSignal.set(false);
        },
      });
  }

  markAllAsRead(): void {
    this.alertsSignal()
      .filter((alert) => !alert.read)
      .forEach((alert) => this.markAsRead(alert));
  }

  private sortByDateDesc(alerts: AlertEntity[]): AlertEntity[] {
    return [...alerts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
