import { BaseResponse } from '../../shared/infrastructure/base.response';

export interface DoctorResponse extends BaseResponse {
  userID?: number | null;
  userId?: number | null;
}
