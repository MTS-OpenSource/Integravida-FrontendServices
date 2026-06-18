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
      this.toNullableNumber(response.patient_id ?? response.patientID ?? response.patientId),
      this.toNullableNumber(
        response.medication_id ?? response.medicationID ?? response.medicationId,
      ),
      this.toNullableString(
        response.description ?? response.symptoms ?? response.effect ?? response.adverse_effect,
      ),
      this.toNullableString(response.severity),
      this.toNullableString(
        response.occurred_at ??
        response.occurredAt ??
        response.reported_at ??
        response.reportedAt ??
        response.createdAt,
      ),
      this.toNullableString(response.status),
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
