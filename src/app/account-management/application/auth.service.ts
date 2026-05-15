import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { userEntity, UserRole } from '../domain/model/user.entity';
import { UserApi } from '../infrastructure/user.api';

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly userApi: UserApi) {}

  signIn(identifier: string, password: string): Observable<userEntity | null> {
    return this.userApi.signIn(identifier, password);
  }

  register(request: RegisterRequest): Observable<userEntity> {
    const user = new userEntity(0, request.email, request.username, request.password, request.role);
    return this.userApi.register(user);
  }
}
