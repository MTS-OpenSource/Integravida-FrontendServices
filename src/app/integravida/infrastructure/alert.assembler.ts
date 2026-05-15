import { BaseAssembler } from '../../shared/infrastructure/base.assembler';
import { AlertEntity } from '../domain/model/alert.entity';
import { AlertResponse } from './alert.response';

export class AlertAssembler extends BaseAssembler<AlertEntity, AlertResponse> {
  override toEntityFrom(response: AlertResponse): AlertEntity {
    return new AlertEntity(
      response['id'],
      this.toNullableNumber(response['patientId']),
      this.toNullableString(response['type']),
      this.toNullableString(response['title']),
      this.toNullableString(response['desc']),
      this.toNullableString(response['time']),
      this.toNullableNumber(response['glucoseValue']),
      this.toNullableString(response['severity']),
      this.toNullableString(response['createdAt']),
      response['read'] ?? false,
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
