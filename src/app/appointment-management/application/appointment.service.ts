import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppointmentEntity } from '../domain/model/appointment.entity';
import { AppointmentApi } from '../infrastructure/appointment.api';
import { AppointmentResponse } from '../infrastructure/appointment.response';

/**
 * Application service for the Appointment Management bounded context.
 *
 * This service manages the appointment state used by the presentation layer.
 * It connects the component with the infrastructure layer without exposing
 * API details directly to the UI.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly appointmentsSignal = signal<AppointmentEntity[]>([]);
  readonly appointments = this.appointmentsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  /**
   * Creates the AppointmentService instance.
   *
   * @param appointmentApi API service used to communicate with the appointments endpoint.
   */
  constructor(private readonly appointmentApi: AppointmentApi) {}

  /**
   * Gets all appointments from the API.
   *
   * This method supports the task T44: AppointmentService - GET.
   */
  getAppointments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.appointmentApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (appointments) => {
          this.appointmentsSignal.set(this.sortByScheduleAsc(appointments));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load appointments'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Gets appointments filtered by patient identifier.
   *
   * @param patientId Patient identifier used to retrieve appointments.
   */
  getAppointmentsByPatientId(patientId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.appointmentApi
      .getByPatientId(patientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (appointments) => {
          this.appointmentsSignal.set(this.sortByScheduleAsc(appointments));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load patient appointments'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Creates a new appointment in the API.
   *
   * This method supports the task T45: AppointmentService - POST.
   *
   * @param patientId Patient identifier related to the appointment.
   * @param doctorId Doctor identifier related to the appointment.
   * @param scheduledAt Scheduled date and time of the appointment.
   * @param notes Additional notes or reason for the appointment.
   */
  createAppointment(
    patientId: number,
    doctorId: number,
    scheduledAt: string,
    notes: string,
  ): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const appointment: AppointmentResponse = {
      id: Date.now(),
      patient_id: patientId,
      doctor_id: doctorId,
      scheduled_at: scheduledAt,
      status: 'pending',
      notes,
    };

    this.appointmentApi
      .create(appointment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdAppointment) => {
          const updatedAppointments = [
            ...this.appointmentsSignal(),
            createdAppointment,
          ];

          this.appointmentsSignal.set(this.sortByScheduleAsc(updatedAppointments));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to create appointment'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Sorts appointments by scheduled date in ascending order.
   *
   * @param appointments Appointment list to sort.
   * @returns Ordered appointment list.
   */
  private sortByScheduleAsc(appointments: AppointmentEntity[]): AppointmentEntity[] {
    return [...appointments].sort((a, b) => {
      const dateA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
      const dateB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;

      return dateA - dateB;
    });
  }

  /**
   * Formats an unknown error into a readable message.
   *
   * @param error Error received from the API.
   * @param fallback Default message when the error cannot be identified.
   * @returns Error message.
   */
  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
