import { BaseEntity } from '../../../shared/infrastructure/base.entity';
/**
 * Represents an appointment inside the Appointment Management bounded context.
 *
 * This entity is used by the Angular application after transforming
 * the raw API response into a cleaner domain model.
 */
export class AppointmentEntity extends BaseEntity {
  /**
   * Creates an appointment entity.
   *
   * @param id Appointment identifier.
   * @param patientId Patient identifier related to the appointment.
   * @param doctorId Doctor identifier related to the appointment.
   * @param scheduledAt Scheduled date and time of the appointment.
   * @param status Current status of the appointment.
   * @param notes Additional notes or reason for the appointment.
   * @param raw Original API response used for traceability.
   */
  constructor(
    id: number,
    public readonly patientId: number | null,
    public readonly doctorId: number | null,
    public readonly scheduledAt: string | null,
    public readonly status: string | null,
    public readonly notes: string | null,
    public readonly raw: Record<string, unknown>,
  ) {
    super(id);
  }
}
