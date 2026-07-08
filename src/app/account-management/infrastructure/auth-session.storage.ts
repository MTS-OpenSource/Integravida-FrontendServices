import { Injectable } from '@angular/core';

import { AuthSession } from '../domain/model/auth-session.model';
import { userEntity } from '../domain/model/user.entity';

@Injectable({
  providedIn: 'root',
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
      const data = JSON.parse(storedUser) as {
        id: number; email: string; username: string; role: string;
        profileId?: string | null; patientId?: string | null; doctorId?: string | null;
      };

      return {
        token,
        user: new userEntity(
          data.id, data.email, data.username,
          data.role as 'Patient' | 'Doctor',
          data.profileId ?? null,
          data.patientId ?? null,
          data.doctorId ?? null,
        ),
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
