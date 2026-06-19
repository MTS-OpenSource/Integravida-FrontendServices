/**
 * Represents the response received from the appointments backend endpoint.
 *
 * The Spring Boot backend uses UUID string identifiers and camelCase fields.
 * Some snake_case fields are still supported to keep compatibility with old fake data.
 */
export interface AppointmentResponse {
  id: string | number;

  patient_id?: string | number | null;
  patientId?: string | number | null;
  patientID?: string | number | null;

  doctor_id?: string | number | null;
  doctorId?: string | number | null;
  doctorID?: string | number | null;

  scheduled_at?: string | null;
  scheduledAt?: string | null;

  status?: string | null;

  notes?: string | null;
  reason?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
  cancelledAt?: string | null;

  [key: string]: unknown;
}
