import { BaseAssembler } from '../../shared/infrastucture/base.assembler';
import { AlertEntity } from '../domain/model/alert.entity';
import { AlertResponse } from './alert.response';

export class AlertAssembler extends BaseAssembler<AlertEntity, AlertResponse> {
  override toEntityFrom(response: AlertResponse): AlertEntity {
    return new AlertEntity(
      response.id,
      this.toNullableNumber(response.patient_id ?? response.patientID ?? response.patientId),
      this.toNullableString(response.type),
      this.toNullableNumber(response.glucose_value ?? response.glucoseValue),
      this.toNullableString(response.severity ?? response.priority),
      this.toNullableString(response.triggered_at ?? response.createdAt ?? response.sentAt),
      this.toNullableBoolean(response.read),
      response,
    );
  }

  private toNullableNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }

  private toNullableString(value: unknown): string | null {
    return typeof value === 'string' ? value : null;
  }

  private toNullableBoolean(value: unknown): boolean | null {
    return typeof value === 'boolean' ? value : null;
  }
}
