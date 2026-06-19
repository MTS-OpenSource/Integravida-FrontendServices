import { BaseEntity } from '../../../shared/infrastructure/base.entity';

/**
 * Represents an appointment inside the Appointment Management bounded context.
 *
 * The local id is numeric to keep compatibility with BaseEntity.
 * The backendId stores the real UUID received from the Spring Boot backend.
 */
export class AppointmentEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly backendId: string,
    public readonly patientId: string | null,
    public readonly doctorId: string | null,
    public readonly scheduledAt: string | null,
    public readonly status: string | null,
    public readonly notes: string | null,
    public readonly raw: Record<string, unknown>,
  ) {
    super(id);
  }
}
