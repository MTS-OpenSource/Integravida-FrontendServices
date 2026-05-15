import { BaseEntity } from '../../../shared/infrastructure/base.entity';

export class MedicationEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly treatmentId: number | null,
    public readonly name: string | null,
    public readonly dose: string | null,
    public readonly frequency: string | null,
    public readonly scheduleTime: string | null,
    public readonly status: string | null,
    public readonly raw: Record<string, unknown>,
  ) {
    super(id);
  }
}
