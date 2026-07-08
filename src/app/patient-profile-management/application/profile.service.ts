import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { AuthStore } from '../../account-management/application/auth.store';
import { ProfileApi } from '../infrastructure/profile.api';
import { ProfileResponse, UpdateProfileRequest } from '../infrastructure/profile.response';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly authStore = inject(AuthStore);
  private readonly profileSignal = signal<ProfileResponse | null>(null);
  readonly profile = this.profileSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private readonly profileApi: ProfileApi) {}

  private get token(): string | null {
    return this.authStore.token();
  }

  loadMyProfile(): void {
    const token = this.token;
    if (!token) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.profileApi.getMe(token).subscribe({
      next: (profile) => {
        this.profileSignal.set(profile);
        this.loadingSignal.set(false);
      },
      error: (err: unknown) => {
        this.errorSignal.set(this.formatError(err, 'No se pudo cargar el perfil'));
        this.loadingSignal.set(false);
      },
    });
  }

  loadById(profileId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.profileApi.getById(profileId).subscribe({
      next: (profile) => {
        this.profileSignal.set(profile);
        this.loadingSignal.set(false);
      },
      error: (err: unknown) => {
        this.errorSignal.set(this.formatError(err, 'No se pudo cargar el perfil'));
        this.loadingSignal.set(false);
      },
    });
  }

  loadByEmail(email: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.profileApi.getByEmail(email).subscribe({
      next: (profiles) => {
        this.profileSignal.set(profiles[0] ?? null);
        this.loadingSignal.set(false);
      },
      error: (err: unknown) => {
        this.errorSignal.set(this.formatError(err, 'No se pudo cargar el perfil'));
        this.loadingSignal.set(false);
      },
    });
  }

  updateMyProfile(request: UpdateProfileRequest): Observable<ProfileResponse> {
    const token = this.token;
    if (!token) throw new Error('No token');

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.profileApi.updateMe(token, request).pipe(
      tap({
        next: (updated) => {
          this.profileSignal.set(updated);
          this.loadingSignal.set(false);
        },
        error: (err: unknown) => {
          this.errorSignal.set(this.formatError(err, 'No se pudo guardar el perfil'));
          this.loadingSignal.set(false);
        },
      }),
    );
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
