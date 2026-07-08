import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthStore } from '../../account-management/application/auth.store';
import { AdverseEffectEntity } from '../domain/model/adverse-effect.entity';
import {
  AdverseEffectApi,
  CreateAdverseEffectPayload,
} from '../infrastructure/adverse-effect.api';

@Injectable({
  providedIn: 'root',
})
export class AdverseEffectService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(AuthStore);

  private readonly adverseEffectsSignal = signal<AdverseEffectEntity[]>([]);
  readonly adverseEffects = this.adverseEffectsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private readonly adverseEffectApi: AdverseEffectApi) {}

  private get token(): string | null {
    return this.authStore.token();
  }

  getByPatientId(): void {
    const token = this.token;
    if (!token) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.adverseEffectApi
      .getByPatientId(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (adverseEffects) => {
          this.adverseEffectsSignal.set(this.sortByDateDesc(adverseEffects));
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load adverse effects'));
          this.loadingSignal.set(false);
        },
      });
  }

  create(payload: CreateAdverseEffectPayload): void {
    const token = this.token;
    if (!token) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.adverseEffectApi
      .create(token, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdAdverseEffect) => {
          this.adverseEffectsSignal.update((adverseEffects) =>
            this.sortByDateDesc([createdAdverseEffect, ...adverseEffects]),
          );
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to register adverse effect'));
          this.loadingSignal.set(false);
        },
      });
  }

  private sortByDateDesc(adverseEffects: AdverseEffectEntity[]): AdverseEffectEntity[] {
    return [...adverseEffects].sort((left, right) => {
      const leftDate = left.takenAt ? new Date(left.takenAt).getTime() : 0;
      const rightDate = right.takenAt ? new Date(right.takenAt).getTime() : 0;
      return rightDate - leftDate;
    });
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;
    return fallback;
  }
}
