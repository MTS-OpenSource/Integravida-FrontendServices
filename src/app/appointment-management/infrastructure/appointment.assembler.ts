import { BaseAssembler } from '../../shared/infrastucture/base.assembler';
import { AppointmentEntity } from '../domain/model/appointment.entity';
import { AppointmentResponse } from './appointment.response';

/**
 * Converts appointment API responses into appointment domain entities.
 *
 * This assembler isolates the transformation logic between the external API
 * structure and the internal model used by the Angular application.
 */
export class AppointmentAssembler extends BaseAssembler<
  AppointmentEntity,
  AppointmentResponse
> {
  /**
   * Converts one AppointmentResponse into one AppointmentEntity.
   *
   * @param response Raw appointment response from the API.
   * @returns Appointment entity used by the application.
   */
  override toEntityFrom(response: AppointmentResponse): AppointmentEntity {
    return new AppointmentEntity(
      response.id,
      this.toNullableNumber(response.patient_id ?? response.patientId ?? response.patientID),
      this.toNullableNumber(response.doctor_id ?? response.doctorId ?? response.doctorID),
      this.toNullableString(response.scheduled_at ?? response.scheduledAt),
      this.toNullableString(response.status),
      this.toNullableString(response.notes),
      response,
    );
  }

  /**
   * Converts an unknown value into a nullable number.
   *
   * @param value Value received from the API.
   * @returns A number when the value is valid, otherwise null.
   */
  private toNullableNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }

  /**
   * Converts an unknown value into a nullable string.
   *
   * @param value Value received from the API.
   * @returns A string when the value is valid, otherwise null.
   */
  private toNullableString(value: unknown): string | null {
    return typeof value === 'string' ? value : null;
  }
}
