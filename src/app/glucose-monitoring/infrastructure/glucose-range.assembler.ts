import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { GlucoseRangeEntity } from '../domain/model/glucose-range.entity';
import { GlucoseRangeResponse } from './glucose-range.response';

export class GlucoseRangeAssembler extends BaseAssembler<
  GlucoseRangeEntity,
  GlucoseRangeResponse
> {
  override toEntityFrom(response: GlucoseRangeResponse): GlucoseRangeEntity {
    return new GlucoseRangeEntity(
      String(response.id),
      this.toNullableString(response.patientId),
      this.toNullableNumber(response.minimumValue),
      this.toNullableNumber(response.maximumValue),
      Boolean(response.active ?? true),
      this.toNullableString(response.createdAt),
      this.toNullableString(response.updatedAt),
      response,
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
