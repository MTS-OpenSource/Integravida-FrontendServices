import { Injectable } from '@angular/core';

import { AuthSession } from '../domain/model/auth-session.model';
import { userEntity } from '../domain/model/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionStorage {
  private readonly tokenStorageKey = 'auth_token';
  private readonly userStorageKey = 'auth_user';

  save(session: AuthSession): void {
    localStorage.setItem(this.tokenStorageKey, session.token);
    localStorage.setItem(this.userStorageKey, JSON.stringify(session.user));
  }

  load(): AuthSession | null {
    const token = localStorage.getItem(this.tokenStorageKey);
    const storedUser = localStorage.getItem(this.userStorageKey);

    if (!token || !storedUser) {
      return null;
    }

    try {
      const user = JSON.parse(storedUser) as userEntity;

      return {
        token,
        user: new userEntity(user.id, user.email, user.username, user.password, user.role)
      };
    } catch {
      this.clear();
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userStorageKey);
  }
}
