import { BaseAssembler } from '../../shared/infrastucture/base.assembler';
import { TreatmentEntity } from '../domain/model/treatment.entity';
import { TreatmentResponse } from './treatment.response';

export class TreatmentAssembler extends BaseAssembler<TreatmentEntity, TreatmentResponse> {
  override toEntityFrom(response: TreatmentResponse): TreatmentEntity {
    return new TreatmentEntity(
      response.id,
      this.toNullableNumber(response.patient_id ?? response.patientId),
      this.toNullableNumber(response.doctor_id ?? response.doctorId),
      this.toNullableString(response.start_date ?? response.startDate),
      this.toNullableString(response.end_date ?? response.endDate),
      this.toNullableString(response.status),
    );
  }

  private toNullableNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }

  private toNullableString(value: unknown): string | null {
    return typeof value === 'string' ? value : null;
  }
}
