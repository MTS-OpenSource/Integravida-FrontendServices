import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { MedicationEntity } from '../domain/model/medication.entity';
import { MedicationResponse } from './medication.response';

export class MedicationAssembler extends BaseAssembler<MedicationEntity, MedicationResponse> {
  override toEntityFrom(response: MedicationResponse): MedicationEntity {
    return new MedicationEntity(
      response.id,
      response.treatmentId,
      response.name,
      response.dosage,
      response.daysOfWeek,
      response.doseTimes,
      response.instructions,
      response.active,
    );
  }
}
