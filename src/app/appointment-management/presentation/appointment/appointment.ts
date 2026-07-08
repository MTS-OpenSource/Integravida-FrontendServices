import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppointmentService } from '../../application/appointment.service';
import { AppointmentEntity } from '../../domain/model/appointment.entity';

@Component({
  selector: 'app-appointment',
  imports: [FormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class AppointmentComponent implements OnInit {
  protected readonly appointmentService = inject(AppointmentService);

  protected readonly selectedDate = signal<string>(this.getDefaultAppointmentDate());
  protected readonly selectedTime = signal<string>(this.getDefaultAppointmentTime());
  protected readonly reason = signal<string>('Consulta de seguimiento');
  protected readonly appointmentToEdit = signal<AppointmentEntity | null>(null);
  protected readonly appointmentToDelete = signal<AppointmentEntity | null>(null);

  protected readonly appointments = this.appointmentService.appointments;
  protected readonly loading = this.appointmentService.loading;
  protected readonly error = this.appointmentService.error;
  protected readonly success = this.appointmentService.success;

  protected readonly totalAppointments = computed(() => this.appointments().length);

  protected readonly upcomingAppointments = computed(() =>
    this.appointments()
      .filter((appointment) => !this.isPastAppointment(appointment))
      .sort((left, right) => this.compareAppointmentsAsc(left, right)),
  );

  protected readonly pastAppointments = computed(() =>
    this.appointments()
      .filter((appointment) => this.isPastAppointment(appointment))
      .sort((left, right) => this.compareAppointmentsDesc(left, right)),
  );

  protected readonly isEditing = computed(() => this.appointmentToEdit() !== null);

  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Modificar cita' : 'Crear cita',
  );

  protected readonly submitLabel = computed(() =>
    this.isEditing() ? 'Guardar cambios' : 'Solicitar cita',
  );

  protected readonly selectedDateTime = computed(() =>
    `${this.selectedDate()}T${this.selectedTime()}`,
  );

  protected readonly selectedDatePreview = computed(() =>
    this.formatDateTime(this.selectedDateTime()),
  );

  protected readonly canSubmit = computed(() =>
    this.selectedDate().trim().length > 0 &&
    this.selectedTime().trim().length > 0 &&
    this.reason().trim().length > 0 &&
    !this.loading(),
  );

  ngOnInit(): void {
    this.loadAppointments();
  }

  protected loadAppointments(): void {
    this.appointmentService.getAppointments();
  }

  protected saveAppointment(): void {
    if (!this.canSubmit()) {
      return;
    }

    const appointment = this.appointmentToEdit();
    const scheduledAt = this.selectedDateTime();
    const reason = this.reason();

    if (appointment) {
      this.appointmentService.updateAppointment(appointment.backendId, scheduledAt, reason);
    } else {
      this.appointmentService.createAppointment(scheduledAt, reason);
    }

    this.resetForm();
  }

  protected editAppointment(appointment: AppointmentEntity): void {
    this.appointmentService.clearMessages();
    this.appointmentToEdit.set(appointment);
    this.appointmentToDelete.set(null);

    const scheduledAt = appointment.scheduledAt ?? this.selectedDateTime();

    this.selectedDate.set(this.extractDate(scheduledAt));
    this.selectedTime.set(this.extractTime(scheduledAt));
    this.reason.set(appointment.notes ?? 'Consulta de seguimiento');
  }

  protected cancelEdit(): void {
    this.appointmentService.clearMessages();
    this.resetForm();
  }

  protected requestDeleteAppointment(appointment: AppointmentEntity): void {
    this.appointmentService.clearMessages();
    this.appointmentToDelete.set(appointment);
  }

  protected cancelDelete(): void {
    this.appointmentToDelete.set(null);
  }

  protected confirmDeleteAppointment(): void {
    const appointment = this.appointmentToDelete();

    if (!appointment) {
      return;
    }

    this.appointmentService.deleteAppointment(appointment.backendId);
    this.appointmentToDelete.set(null);

    if (this.appointmentToEdit()?.backendId === appointment.backendId) {
      this.resetForm();
    }
  }

  protected resetForm(): void {
    this.appointmentToEdit.set(null);
    this.selectedDate.set(this.getDefaultAppointmentDate());
    this.selectedTime.set(this.getDefaultAppointmentTime());
    this.reason.set('Consulta de seguimiento');
  }

  protected formatDateTime(value: string | null): string {
    if (!value) return 'Fecha no registrada';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(date);
  }

  protected formatStatus(status: string | null): string {
    const normalizedStatus = this.normalizeStatus(status);

    if (normalizedStatus.includes('confirmed')) return 'Confirmada';
    if (normalizedStatus.includes('cancel')) return 'Cancelada';
    if (normalizedStatus.includes('completed')) return 'Completada';
    if (normalizedStatus.includes('pending')) return 'Pendiente';

    return status ?? 'Pendiente';
  }

  protected statusClass(status: string | null): string {
    const normalizedStatus = this.normalizeStatus(status);

    if (normalizedStatus.includes('confirmed')) return 'status-confirmed';
    if (normalizedStatus.includes('cancel')) return 'status-cancelled';
    if (normalizedStatus.includes('completed')) return 'status-completed';

    return 'status-pending';
  }

  protected shortId(appointment: AppointmentEntity): string {
    return appointment.backendId ? appointment.backendId.slice(0, 8) : String(appointment.id);
  }

  private isPastAppointment(appointment: AppointmentEntity): boolean {
    if (!appointment.scheduledAt) return false;

    const scheduledDate = new Date(appointment.scheduledAt);

    if (Number.isNaN(scheduledDate.getTime())) {
      return false;
    }

    return scheduledDate.getTime() < Date.now();
  }

  private compareAppointmentsAsc(left: AppointmentEntity, right: AppointmentEntity): number {
    return this.toTimestamp(left.scheduledAt) - this.toTimestamp(right.scheduledAt);
  }

  private compareAppointmentsDesc(left: AppointmentEntity, right: AppointmentEntity): number {
    return this.toTimestamp(right.scheduledAt) - this.toTimestamp(left.scheduledAt);
  }

  private toTimestamp(value: string | null): number {
    if (!value) return 0;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 0;
    }

    return date.getTime();
  }

  private normalizeStatus(status: string | null): string {
    return (status ?? 'pending').toLowerCase();
  }

  private extractDate(value: string): string {
    if (value.length >= 10) {
      return value.slice(0, 10);
    }

    return this.getDefaultAppointmentDate();
  }

  private extractTime(value: string): string {
    if (value.length >= 16) {
      return value.slice(11, 16);
    }

    return this.getDefaultAppointmentTime();
  }

  private getDefaultAppointmentDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    return this.toDateInputValue(date);
  }

  private getDefaultAppointmentTime(): string {
    const date = new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);

    return this.toTimeInputValue(date);
  }

  private toDateInputValue(date: Date): string {
    const pad = (value: number): string => String(value).padStart(2, '0');

    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join('-');
  }

  private toTimeInputValue(date: Date): string {
    const pad = (value: number): string => String(value).padStart(2, '0');

    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
