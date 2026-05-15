import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { PatientEntity } from '../domain/model/patient.entity';
import { PatientResponse } from './patient.response';

export class PatientAssembler extends BaseAssembler<PatientEntity, PatientResponse> {
  override toEntityFrom(response: PatientResponse): PatientEntity {
    return new PatientEntity(response.id, this.toNullableNumber(response.userID ?? response.userId));
  }

  private toNullableNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }
}
