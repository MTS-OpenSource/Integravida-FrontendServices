import { BaseEntity } from '../../../shared/infrastructure/base.entity';

export class AdverseEffectEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly patientId: number | null,
    public readonly medicationId: number | null,
    public readonly description: string | null,
    public readonly severity: string | null,
    public readonly occurredAt: string | null,
    public readonly status: string | null,
    public readonly raw: Record<string, unknown>,
  ) {
    super(id);
  }
}
