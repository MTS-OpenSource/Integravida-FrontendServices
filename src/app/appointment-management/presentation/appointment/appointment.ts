import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppointmentService } from '../../application/appointment.service';

/**
 * Appointment Management component.
 *
 * This component belongs to the presentation layer of the Appointment Management
 * bounded context. It displays the appointment list, allows creating a new
 * appointment and includes a basic alert configuration section.
 */
@Component({
  selector: 'app-appointment',
  imports: [FormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class AppointmentComponent implements OnInit {
  protected readonly appointmentService = inject(AppointmentService);

  protected readonly patientId = signal<number>(1);
  protected readonly doctorId = signal<number>(1);
  protected readonly scheduledAt = signal<string>('20/05/2026 10:30');
  protected readonly notes = signal<string>('Revisión médica de control');

  protected readonly appointmentRemindersEnabled = signal<boolean>(true);
  protected readonly cancellationNotificationsEnabled = signal<boolean>(true);
  protected readonly glucoseAlertsEnabled = signal<boolean>(false);
  protected readonly medicationAlertsEnabled = signal<boolean>(false);

  protected readonly appointments = this.appointmentService.appointments;
  protected readonly loading = this.appointmentService.loading;
  protected readonly error = this.appointmentService.error;

  protected readonly totalAppointments = computed(() => this.appointments().length);

  /**
   * Loads the initial appointment list when the component is initialized.
   */
  ngOnInit(): void {
    this.loadAppointments();
  }

  /**
   * Loads appointments filtered by the selected patient.
   *
   * This supports the task T44: AppointmentService - GET.
   */
  protected loadAppointments(): void {
    this.appointmentService.getAppointmentsByPatientId(this.patientId());
  }

  /**
   * Creates a new appointment using the form data.
   *
   * This supports the task T43: Crear cita and T45: AppointmentService - POST.
   */
  protected createAppointment(): void {
    this.appointmentService.createAppointment(
      this.patientId(),
      this.doctorId(),
      this.scheduledAt(),
      this.notes(),
    );

    this.notes.set('');
  }

  /**
   * Updates the patient identifier from the form input.
   *
   * @param value Input value received from the template.
   */
  protected updatePatientId(value: string): void {
    this.patientId.set(Number(value));
  }

  /**
   * Updates the doctor identifier from the form input.
   *
   * @param value Input value received from the template.
   */
  protected updateDoctorId(value: string): void {
    this.doctorId.set(Number(value));
  }
}
