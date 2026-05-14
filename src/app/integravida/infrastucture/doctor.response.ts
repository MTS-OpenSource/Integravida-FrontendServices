import { BaseResponse } from '../../shared/infrastucture/base.response';

export interface DoctorResponse extends BaseResponse {
  userID?: number | null;
  userId?: number | null;
}
