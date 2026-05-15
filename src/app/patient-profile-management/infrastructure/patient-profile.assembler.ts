import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { PatientProfileEntity } from '../domain/model/patient-profile.entity';
import { PatientProfileResponse } from './patient-profile.response';

export class PatientProfileAssembler extends BaseAssembler<
  PatientProfileEntity,
  PatientProfileResponse
> {
  override toEntityFrom(response: PatientProfileResponse): PatientProfileEntity {
    return new PatientProfileEntity(
      response.id,
      response.userID ?? response.userId ?? null,
      response.fullName ?? '',
      response.diabetesType ?? null,
      response.phone ?? '',
    );
  }

  toResourceFrom(entity: PatientProfileEntity): PatientProfileResponse {
    return {
      id: entity.id,
      userID: entity.userId,
      fullName: entity.fullName,
      diabetesType: entity.diabetesType,
      phone: entity.phone,
    };
  }
}
