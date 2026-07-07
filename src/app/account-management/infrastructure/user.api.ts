import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base.api';
import { userEntity } from '../domain/model/user.entity';
import { UserAssembler } from './user.assembler';
import { UserApiEndpoint } from './user.api.endpoint';
import { UserResponse } from './user.response';

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

  signIn(username: string, password: string): Observable<userEntity | null> {
    return this.http
      .post<UserResponse>(this.userEndpoint.signIn(), { username, password })
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }

  register(user: Omit<userEntity, 'id'>): Observable<userEntity> {
    const resource = {
      emil: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
    };

    return this.http
      .post<UserResponse>(this.userEndpoint.getAll(), resource)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
