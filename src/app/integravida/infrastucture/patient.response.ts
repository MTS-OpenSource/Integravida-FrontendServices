import { BaseResponse } from '../../shared/infrastucture/base.response';

export interface PatientResponse extends BaseResponse {
  userID?: number | null;
  userId?: number | null;
}
