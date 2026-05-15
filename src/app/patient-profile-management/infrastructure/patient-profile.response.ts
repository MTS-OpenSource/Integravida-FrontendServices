import { BaseResponse } from '../../shared/infrastructure/base.response';

export interface PatientProfileResponse extends BaseResponse {
  userID?: number | null;
  userId?: number | null;
  fullName?: string | null;
  diabetesType?: number | null;
  phone?: string | null;
}
