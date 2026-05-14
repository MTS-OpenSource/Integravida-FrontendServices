import { BaseResponse } from '../../shared/infrastucture/base.response';

export interface MedicationResponse extends BaseResponse {
  treatment_id?: number | null;
  treatmentId?: number | null;
  name?: string | null;
  dose?: string | null;
  frequency?: string | null;
  schedule_time?: string | null;
  scheduleTime?: string | null;
  [key: string]: unknown;
}
