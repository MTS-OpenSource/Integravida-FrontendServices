import { BaseEntity } from '../../../shared/infrastucture/base.entity';

export class GlucoseRecordEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly patientId: number | null,
    public readonly glucoseLevel: number | null,
    public readonly recordedAt: string | null,
    public readonly raw: Record<string, unknown>,
  ) {
    super(id);
  }
}
