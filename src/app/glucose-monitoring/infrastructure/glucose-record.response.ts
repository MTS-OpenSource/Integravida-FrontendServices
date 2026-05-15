import { BaseResponse } from '../../shared/infrastructure/base.response';

export interface GlucoseRecordResponse extends BaseResponse {
  patientID?: number | null;
  patientId?: number | null;
  patient_id?: number | null;
  glucoseLevel?: number | null;
  glucoseValue?: number | null;
  valueMgdl?: number | null;
  value?: number | null;
  recordedAt?: string | null;
  createdAt?: string | null;
  measurementDate?: string | null;
  timestamp?: string | null;
  [key: string]: unknown;
}
