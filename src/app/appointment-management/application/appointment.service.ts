import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthStore } from '../../account-management/application/auth.store';
import { AppointmentEntity } from '../domain/model/appointment.entity';
import {
  AppointmentApi,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../infrastructure/appointment.api';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(AuthStore);

  private readonly appointmentsSignal = signal<AppointmentEntity[]>([]);
  readonly appointments = this.appointmentsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  private readonly successSignal = signal<string | null>(null);
  readonly success = this.successSignal.asReadonly();

  constructor(private readonly appointmentApi: AppointmentApi) {}

  getAppointments(): void {
    const token = this.token;

    if (!token) {
      this.appointmentsSignal.set([]);
      this.errorSignal.set('Debes iniciar sesión para visualizar tus citas.');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successSignal.set(null);

    this.appointmentApi
      .getAll(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (appointments) => {
          this.appointmentsSignal.set(this.sortByScheduleAsc(appointments));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'No se pudieron cargar las citas.'));
          this.loadingSignal.set(false);
        },
      });
  }

  createAppointment(scheduledAt: string, reason: string): void {
    const token = this.token;

    if (!token) {
      this.errorSignal.set('Debes iniciar sesión para solicitar una cita.');
      return;
    }

    const cleanReason = reason.trim();

    if (!scheduledAt || !cleanReason) {
      this.errorSignal.set('Selecciona una fecha, una hora y escribe el motivo de la cita.');
      return;
    }

    const appointment: CreateAppointmentPayload = {
      scheduledAt: this.normalizeScheduledAt(scheduledAt),
      reason: cleanReason,
    };

    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successSignal.set(null);

    this.appointmentApi
      .create(token, appointment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdAppointment) => {
          this.appointmentsSignal.update((appointments) =>
            this.sortByScheduleAsc([...appointments, createdAppointment]),
          );
          this.successSignal.set('Cita creada correctamente.');
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'No se pudo crear la cita.'));
          this.loadingSignal.set(false);
        },
      });
  }

  updateAppointment(id: string | number, scheduledAt: string, reason: string): void {
    const token = this.token;

    if (!token) {
      this.errorSignal.set('Debes iniciar sesión para modificar una cita.');
      return;
    }

    const cleanReason = reason.trim();

    if (!id || !scheduledAt || !cleanReason) {
      this.errorSignal.set('Selecciona una cita válida, una fecha, una hora y un motivo.');
      return;
    }

    const appointment: UpdateAppointmentPayload = {
      scheduledAt: this.normalizeScheduledAt(scheduledAt),
      reason: cleanReason,
    };

    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successSignal.set(null);

    this.appointmentApi
      .update(token, id, appointment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedAppointment) => {
          this.appointmentsSignal.update((appointments) =>
            this.sortByScheduleAsc(
              appointments.map((appointmentItem) =>
                appointmentItem.backendId === String(id) ? updatedAppointment : appointmentItem,
              ),
            ),
          );
          this.successSignal.set('Cita actualizada correctamente.');
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'No se pudo actualizar la cita.'));
          this.loadingSignal.set(false);
        },
      });
  }

  deleteAppointment(id: string | number): void {
    const token = this.token;

    if (!token) {
      this.errorSignal.set('Debes iniciar sesión para eliminar una cita.');
      return;
    }

    if (!id) {
      this.errorSignal.set('Selecciona una cita válida para eliminar.');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successSignal.set(null);

    this.appointmentApi
      .delete(token, id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.appointmentsSignal.update((appointments) =>
            appointments.filter((appointment) => appointment.backendId !== String(id)),
          );
          this.successSignal.set('Cita eliminada correctamente.');
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'No se pudo eliminar la cita.'));
          this.loadingSignal.set(false);
        },
      });
  }

  clearMessages(): void {
    this.errorSignal.set(null);
    this.successSignal.set(null);
  }

  private get token(): string | null {
    return this.authStore.token();
  }

  private sortByScheduleAsc(appointments: AppointmentEntity[]): AppointmentEntity[] {
    return [...appointments].sort((a, b) => {
      const dateA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
      const dateB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;

      return dateA - dateB;
    });
  }

  private normalizeScheduledAt(scheduledAt: string): string {
    const cleanScheduledAt = scheduledAt.trim();

    if (cleanScheduledAt.length === 16) {
      return `${cleanScheduledAt}:00`;
    }

    return cleanScheduledAt.slice(0, 19);
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;

      if (typeof message === 'string') {
        return message;
      }

      if (error.status === 401 || error.status === 403) {
        return 'Tu sesión no es válida. Vuelve a iniciar sesión.';
      }

      if (error.status === 404) {
        return 'No se encontró la cita o todavía no tienes un doctor asignado.';
      }

      return fallback;
    }

    if (error instanceof Error) return error.message;

    return fallback;
  }
}
