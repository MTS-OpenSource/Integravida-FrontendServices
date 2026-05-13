import { BaseEntity } from '../../../shared/infrastucture/base.entity';

export class PatientEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly userId: number | null,
  ) {
    super(id);
  }
}
