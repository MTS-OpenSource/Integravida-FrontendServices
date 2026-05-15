import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

import { AuthSession } from '../domain/model/auth-session.model';
import { userEntity } from '../domain/model/user.entity';
import { AuthSessionStorage } from '../infrastructure/auth-session.storage';
import { UserApi } from '../infrastructure/user.api';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly currentUserSignal = signal<userEntity | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  private readonly tokenSignal = signal<string | null>(null);
  readonly token = this.tokenSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly isAuthenticated = computed(() => !!this.token());

  constructor(
    private readonly userApi: UserApi,
    private readonly authSessionStorage: AuthSessionStorage,
  ) {
    const storedSession = this.authSessionStorage.load();

    this.currentUserSignal.set(storedSession?.user ?? null);
    this.tokenSignal.set(storedSession?.token ?? null);
  }

  signIn(identifier: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi
      .signIn(identifier, password)
      .pipe(retry(2), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          if (!user) {
            this.clearSession();
            this.errorSignal.set('Invalid credentials');
            this.loadingSignal.set(false);
            return;
          }

          const session = this.createSession(user);
          this.authSessionStorage.save(session);
          this.currentUserSignal.set(session.user);
          this.tokenSignal.set(session.token);
          this.loadingSignal.set(false);
        },
        error: (error: unknown) => {
          this.errorSignal.set(this.formatError(error, 'Failed to sign in'));
          this.loadingSignal.set(false);
        },
      });
  }
  signOut(): void {
    this.clearSession();
    this.errorSignal.set(null);
  }

  getCurrentSession(): AuthSession | null {
    const token = this.token();
    const user = this.currentUser();

    if (!token || !user) {
      return null;
    }

    return { token, user };
  }

  private createSession(user: userEntity): AuthSession {
    return {
      token: btoa(`${user.id}:${user.username}:${user.role}:${Date.now()}`),
      user,
    };
  }

  private clearSession(): void {
    this.authSessionStorage.clear();
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }
}
