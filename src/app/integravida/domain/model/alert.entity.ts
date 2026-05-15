import { BaseEntity } from '../../../shared/infrastructure/base.entity';

export class AlertEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly patientId: number | null,
    public readonly type: string | null,
    public readonly title: string | null,
    public readonly desc: string | null,
    public readonly time: string | null,
    public readonly glucoseValue: number | null,
    public readonly severity: string | null,
    public readonly createdAt: string | null,
    public readonly read: boolean | null,
    public readonly raw: Record<string, unknown>,
  ) {
    super(id);
  }
}
