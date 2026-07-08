import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { AdverseEffectEntity } from '../domain/model/adverse-effect.entity';
import { AdverseEffectResponse } from './adverse-effect.response';

export class AdverseEffectAssembler extends BaseAssembler<
  AdverseEffectEntity,
  AdverseEffectResponse
> {
  override toEntityFrom(response: AdverseEffectResponse): AdverseEffectEntity {
    return new AdverseEffectEntity(
      response.id,
      response.medicationId,
      response.patientId,
      response.takenAt,
      response.notes,
      response.createdAt,
    );
  }
}
