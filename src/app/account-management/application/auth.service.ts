import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserRole } from '../domain/model/user.entity';
import { UserApi, RegisterUserRequest } from '../infrastructure/user.api';

export interface RegisterRequest {
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
export class AuthService {
  constructor(private readonly userApi: UserApi) {}

  signIn(identifier: string, password: string): Observable<string> {
    return this.userApi.signIn(identifier, password);
  }

  register(request: RegisterRequest): Observable<string> {
    const apiRequest: RegisterUserRequest = {
      username: request.username,
      password: request.password,
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      phoneNumber: request.phoneNumber,
      dateOfBirth: request.dateOfBirth,
      role: request.role,
    };
    return this.userApi.register(apiRequest);
  }
}
