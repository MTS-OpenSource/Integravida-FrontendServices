import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { GlucoseRecordEntity } from '../domain/model/glucose-record.entity';
import { GlucoseRecordResponse } from './glucose-record.response';

export class GlucoseRecordAssembler extends BaseAssembler<
  GlucoseRecordEntity,
  GlucoseRecordResponse
> {
  override toEntityFrom(response: GlucoseRecordResponse): GlucoseRecordEntity {
    return new GlucoseRecordEntity(
      String(response.id),
      this.toNullableString(response.patientId ?? response.patientID ?? response.patient_id),
      this.toNullableNumber(
        response.glucoseValue ?? response.glucoseLevel ?? response.valueMgdl ?? response.value,
      ),
      this.toNullableString(
        response.measuredAt ?? response.recordedAt ?? response.measurementDate ?? response.timestamp ?? response.createdAt,
      ),
      response,
      this.toNullableString(response.notes ?? null),
    );
  }

  private toNullableNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }

  private toNullableString(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    return null;
  }
}
