import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AlertApi } from '../infrastructure/alert.api';
import { AlertEntity } from '../domain/model/alert.entity';

import { forkJoin } from 'rxjs';

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

  readonly unreadCount = computed(() => this.activeAlerts().length);

  readonly hasUnreadAlerts = computed(() => this.unreadCount() > 0);

  getAlerts(patientId: number, unreadOnly = false): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.alertApi
      .getByPatientId(patientId, unreadOnly)
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
    if (alert.read) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.alertApi
      .markAsRead(alert.id)
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
    const unreadAlerts = this.alertsSignal().filter((alert) => !alert.read);

    if (unreadAlerts.length === 0) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin(unreadAlerts.map((alert) => this.alertApi.markAsRead(alert.id)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedAlerts) => {
          const updatedAlertsById = new Map(
            updatedAlerts.map((updatedAlert) => [updatedAlert.id, updatedAlert]),
          );

          this.alertsSignal.update((alerts) =>
            alerts.map((alert) => updatedAlertsById.get(alert.id) ?? alert),
          );

          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to mark all alerts as read'));
          this.loadingSignal.set(false);
        },
      });
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
