import { BaseEntity } from '../../../shared/infrastucture/base.entity';

export type UserRole = 'Patient' | 'Doctor';

export class userEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly email: string,
    public readonly username: string,
    public readonly password: string,
    public readonly role: UserRole
  ) {
    super(id);
  }
}
