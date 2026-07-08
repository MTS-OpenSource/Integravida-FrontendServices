import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { TreatmentEntity } from '../domain/model/treatment.entity';
import { TreatmentResponse } from './treatment.response';

export class TreatmentAssembler extends BaseAssembler<TreatmentEntity, TreatmentResponse> {
  override toEntityFrom(response: TreatmentResponse): TreatmentEntity {
    return new TreatmentEntity(
      response.id,
      response.patientId,
      response.name,
      response.description,
      response.startDate,
      response.endDate,
      response.status,
    );
  }
}
