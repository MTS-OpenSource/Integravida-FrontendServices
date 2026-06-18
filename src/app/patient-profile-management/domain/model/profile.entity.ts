import { BaseEntity } from '../../../shared/infrastructure/base.entity';

export class ProfileEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly profileId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly dateOfBirth: string,
  ) {
    super(id);
  }
}
