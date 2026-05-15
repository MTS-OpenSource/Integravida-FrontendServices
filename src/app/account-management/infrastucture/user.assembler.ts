import { BaseAssembler } from '../../shared/infrastucture/base.assembler';
import { userEntity } from '../domain/model/user.entity';
import { UserResponse } from './user.response';

export class UserAssembler extends BaseAssembler<userEntity, UserResponse> {
  override toEntityFrom(response: UserResponse): userEntity {
    return new userEntity(
      response.id,
      response.emil,
      response.username,
      response.password,
      response.role,
    );
  }
}
