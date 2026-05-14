import { BaseAssembler } from '../../shared/infrastucture/base.assembler';
import { MedicationEntity } from '../domain/model/medication.entity';
import { MedicationResponse } from './medication.response';

export class MedicationAssembler extends BaseAssembler<MedicationEntity, MedicationResponse> {
  override toEntityFrom(response: MedicationResponse): MedicationEntity {
    return new MedicationEntity(
      response.id,
      this.toNullableNumber(response.treatment_id ?? response.treatmentId),
      this.toNullableString(response.name),
      this.toNullableString(response.dose),
      this.toNullableString(response.frequency),
      this.toNullableString(response.schedule_time ?? response.scheduleTime),
      response,
    );
  }

  private toNullableNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }

  private toNullableString(value: unknown): string | null {
    return typeof value === 'string' ? value : null;
  }

}
