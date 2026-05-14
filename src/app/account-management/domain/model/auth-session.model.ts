import { userEntity } from './user.entity';

export interface AuthSession {
  token: string;
  user: userEntity;
}
