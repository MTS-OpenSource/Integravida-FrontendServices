import { BaseAssembler } from '../../shared/infrastucture/base.assembler';
import { GlucoseRecordEntity } from '../domain/model/glucose-record.entity';
import { GlucoseRecordResponse } from './glucose-record.response';

export class GlucoseRecordAssembler extends BaseAssembler<
  GlucoseRecordEntity,
  GlucoseRecordResponse
> {
  override toEntityFrom(response: GlucoseRecordResponse): GlucoseRecordEntity {
    return new GlucoseRecordEntity(
      response.id,
      this.toNullableNumber(response.patientID ?? response.patientId ?? response.patient_id),
      this.toNullableNumber(
        response.valueMgdl ?? response.glucoseLevel ?? response.glucoseValue ?? response.value,
      ),
      this.toNullableString(
        response.recordedAt ?? response.createdAt ?? response.measurementDate ?? response.timestamp
      ),
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
