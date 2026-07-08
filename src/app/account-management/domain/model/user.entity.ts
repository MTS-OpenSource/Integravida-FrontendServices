import { BaseEntity } from '../../../shared/infrastructure/base.entity';

export type UserRole = 'Patient' | 'Doctor';

export interface JwtClaims {
  sub: string;
  role: string;
  profileId: string;
  patientId?: string;
  doctorId?: string;
  iat?: number;
  exp?: number;
}

export class userEntity extends BaseEntity {
  constructor(
    id: number,
    public readonly email: string,
    public readonly username: string,
    public readonly role: UserRole,
    public readonly profileId: string | null = null,
    public readonly patientId: string | null = null,
    public readonly doctorId: string | null = null,
  ) {
    super(id);
  }

  get isPatient(): boolean {
    return this.role === 'Patient';
  }

  get isDoctor(): boolean {
    return this.role === 'Doctor';
  }

  static fromJwt(token: string): userEntity | null {
    try {
      const payload = token.split('.')[1];
      const clean = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(atob(clean)) as JwtClaims;
      const role: UserRole = json.role === 'PATIENT' ? 'Patient' : 'Doctor';
      return new userEntity(
        0,
        '',
        json.sub,
        role,
        json.profileId,
        json.patientId ?? null,
        json.doctorId ?? null,
      );
    } catch {
      return null;
    }
  }
}
