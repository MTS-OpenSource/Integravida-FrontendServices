import { BaseEntity } from '../../../shared/infrastructure/base.entity';

export class PatientEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly userId: number | null,
  ) {
    super(id);
  }
}
