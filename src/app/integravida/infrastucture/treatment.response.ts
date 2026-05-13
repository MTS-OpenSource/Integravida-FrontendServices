import { BaseResponse } from '../../shared/infrastucture/base.response';

export interface TreatmentResponse extends BaseResponse {
  patient_id?: number | null;
  patientId?: number | null;
  doctor_id?: number | null;
  doctorId?: number | null;
  start_date?: string | null;
  startDate?: string | null;
  end_date?: string | null;
  endDate?: string | null;
  status?: string | null;
}
