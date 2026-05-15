import { BaseResponse } from '../../shared/infrastructure/base.response';
/**
 * Represents the response received from the appointments API endpoint.
 *
 * The API uses snake_case fields such as patient_id, doctor_id and scheduled_at.
 * This response interface keeps that external structure before it is converted
 * into an AppointmentEntity.
 */
export interface AppointmentResponse extends BaseResponse {
  patient_id?: number | null;
  patientId?: number | null;
  patientID?: number | null;

  doctor_id?: number | null;
  doctorId?: number | null;
  doctorID?: number | null;

  scheduled_at?: string | null;
  scheduledAt?: string | null;

  status?: string | null;
  notes?: string | null;

  /**
   * Allows additional fields from the fake API without breaking the application.
   */
  [key: string]: unknown;
}
