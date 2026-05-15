import { BaseResponse } from '../../shared/infrastructure/base.response';

export interface AlertResponse extends BaseResponse {
  patient_id?: number | null;
  patientID?: number | null;
  patientId?: number | null;
  type?: string | null;
  glucose_value?: number | null;
  glucoseValue?: number | null;
  severity?: string | null;
  priority?: string | null;
  createdAt?: string | null;
  triggered_at?: string | null;
  sentAt?: string | null;
  read?: boolean | null;
  [key: string]: unknown;
}
