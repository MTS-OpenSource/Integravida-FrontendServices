import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { UserRole } from '../domain/model/user.entity';
import { BaseApi } from '../../shared/infrastructure/base.api';
import { userEntity } from '../domain/model/user.entity';
import { UserAssembler } from './user.assembler';
import { UserApiEndpoint } from './user.api.endpoint';
import { AuthTokenResponse, UserResponse } from './user.response';

export interface RegisterUserRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class UserApi extends BaseApi<userEntity, UserResponse> {
  constructor(private readonly userEndpoint: UserApiEndpoint) {
    super(userEndpoint, new UserAssembler());
  }

  getAll(): Observable<userEntity[]> {
    return this.getAllFrom(this.userEndpoint.getAll());
  }

  getById(id: number): Observable<userEntity | null> {
    return this.getOneFrom(this.userEndpoint.getById(id));
  }

  signIn(username: string, password: string): Observable<string> {
    return this.http
      .post<AuthTokenResponse>(this.userEndpoint.signIn(), { username, password })
      .pipe(map((response) => response.token));
  }

  register(request: RegisterUserRequest): Observable<string> {
    return this.http
      .post<AuthTokenResponse>(this.userEndpoint.signUp(), request)
      .pipe(map((response) => response.token));
  }
}
