import { BaseEntity } from '../../../shared/infrastructure/base.entity';

export class TreatmentEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly patientId: number | null,
    public readonly doctorId: number | null,
    public readonly startDate: string | null,
    public readonly endDate: string | null,
    public readonly status: string | null,
  ) {
    super(id);
  }
}
