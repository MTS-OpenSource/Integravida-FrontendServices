import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProfileApiEndpoint } from './profile.api.endpoint';
import { ProfileResponse, UpdateProfileRequest } from './profile.response';

@Injectable({
  providedIn: 'root',
})
export class ProfileApi {
  constructor(
    private readonly http: HttpClient,
    private readonly endpoint: ProfileApiEndpoint,
  ) {}

  getById(profileId: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.endpoint.getById(profileId));
  }

  getByEmail(email: string): Observable<ProfileResponse[]> {
    return this.http.get<ProfileResponse[]>(this.endpoint.getByEmail(email));
  }

  getAll(): Observable<ProfileResponse[]> {
    return this.http.get<ProfileResponse[]>(this.endpoint.getAll());
  }

  update(profileId: string, request: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(
      this.endpoint.getById(profileId),
      request,
    );
  }
}
