import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { PatientProfileEntity } from '../domain/model/patient-profile.entity';
import { PatientProfileApi } from '../infrastructure/patient-profile.api';

@Injectable({
  providedIn: 'root',
})
export class PatientProfileService {
  private readonly profileSignal = signal<PatientProfileEntity | null>(null);
  readonly profile = this.profileSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private readonly patientProfileApi: PatientProfileApi) {}

  getProfile(patientId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.patientProfileApi.getProfile(patientId).subscribe({
      next: (profile) => {
        this.profileSignal.set(profile);
        this.loadingSignal.set(false);
      },
      error: (error: unknown) => {
        this.errorSignal.set(this.formatError(error, 'No se pudo cargar el perfil'));
        this.loadingSignal.set(false);
      },
    });
  }

  saveProfile(profile: PatientProfileEntity): Observable<PatientProfileEntity> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.patientProfileApi.updateProfile(profile).pipe(
      tap({
        next: (updatedProfile) => {
          this.profileSignal.set(updatedProfile);
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'No se pudo guardar el perfil'));
          this.loadingSignal.set(false);
        },
      }),
    );
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }
}
