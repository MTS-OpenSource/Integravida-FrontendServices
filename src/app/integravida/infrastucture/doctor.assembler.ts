import { BaseAssembler } from '../../shared/infrastucture/base.assembler';
import { DoctorEntity } from '../domain/model/doctor.entity';
import { DoctorResponse } from './doctor.response';

export class DoctorAssembler extends BaseAssembler<DoctorEntity, DoctorResponse> {
  override toEntityFrom(response: DoctorResponse): DoctorEntity {
    return new DoctorEntity(response.id, this.toNullableNumber(response.userID ?? response.userId));
  }

  private toNullableNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }
}
