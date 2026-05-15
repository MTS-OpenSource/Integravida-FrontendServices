import { BaseResponse } from '../../shared/infrastructure/base.response';

export interface PatientResponse extends BaseResponse {
  userID?: number | null;
  userId?: number | null;
}
