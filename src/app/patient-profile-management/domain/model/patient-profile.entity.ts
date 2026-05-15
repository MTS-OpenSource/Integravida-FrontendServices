import { BaseEntity } from '../../../shared/infrastructure/base.entity';

export class PatientProfileEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly userId: number | null,
    public readonly fullName: string,
    public readonly diabetesType: number | null,
    public readonly phone: string,
  ) {
    super(id);
  }
}
