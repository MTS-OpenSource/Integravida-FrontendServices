import { BaseResponse } from '../../shared/infrastructure/base.response';
import { UserRole } from '../domain/model/user.entity';

export interface UserResponse extends BaseResponse {
  emil: string;
  username: string;
  password: string;
  role: UserRole;
}
