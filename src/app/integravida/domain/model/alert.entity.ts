import { BaseEntity } from '../../../shared/infrastucture/base.entity';

export class AlertEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly patientId: number | null,
    public readonly type: string | null,
    public readonly glucoseValue: number | null,
    public readonly severity: string | null,
    public readonly createdAt: string | null,
    public readonly read: boolean | null,
    public readonly raw: Record<string, unknown>,
  ) {
    super(id);
  }
}
