import { BaseResponse } from '../../shared/infrastructure/base.response';

export interface AdverseEffectResponse extends BaseResponse {
  patient_id?: number | null;
  patientID?: number | null;
  patientId?: number | null;
  medication_id?: number | null;
  medicationID?: number | null;
  medicationId?: number | null;
  description?: string | null;
  symptoms?: string | null;
  effect?: string | null;
  adverse_effect?: string | null;
  severity?: string | null;
  occurred_at?: string | null;
  occurredAt?: string | null;
  reported_at?: string | null;
  reportedAt?: string | null;
  createdAt?: string | null;
  status?: string | null;
  [key: string]: unknown;
}
