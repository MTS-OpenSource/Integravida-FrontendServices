import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { AppointmentEntity } from '../domain/model/appointment.entity';
import { AppointmentResponse } from './appointment.response';

/**
 * Converts appointment API responses into appointment domain entities.
 */
export class AppointmentAssembler extends BaseAssembler<AppointmentEntity, AppointmentResponse> {
  override toEntityFrom(response: AppointmentResponse): AppointmentEntity {
    return new AppointmentEntity(
      this.toLocalNumericId(response.id),
      String(response.id),
      this.toNullableIdentifier(response.patient_id ?? response.patientId ?? response.patientID),
      this.toNullableIdentifier(response.doctor_id ?? response.doctorId ?? response.doctorID),
      this.toNullableString(response.scheduled_at ?? response.scheduledAt),
      this.toNullableString(response.status),
      this.toNullableString(response.notes ?? response.reason),
      response,
    );
  }

  private toLocalNumericId(value: unknown): number {
    if (typeof value === 'number') return value;

    if (typeof value === 'string') {
      let hash = 0;

      for (const character of value) {
        hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
      }

      return hash;
    }

    return Date.now();
  }

  private toNullableIdentifier(value: unknown): string | null {
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return value;
    return null;
  }

  private toNullableString(value: unknown): string | null {
    return typeof value === 'string' ? value : null;
  }
}
