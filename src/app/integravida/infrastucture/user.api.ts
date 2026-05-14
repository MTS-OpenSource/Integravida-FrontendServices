import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';

import { BaseApi } from '../../shared/infrastucture/base.api';
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

  signIn(identifier: string, password: string): Observable<userEntity | null> {
    return this.http
      .get<UserResponse[]>(this.userEndpoint.getByUsernameAndPassword(identifier, password))
      .pipe(map((response) => (response[0] ? this.assembler.toEntityFrom(response[0]) : null)));
  }
}
