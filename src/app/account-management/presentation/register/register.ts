import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../application/auth.store';
import { UserRole } from '../../domain/model/user.entity';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly role = signal<UserRole>('Patient');
  protected readonly email = signal('');
  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly formError = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        void this.router.navigate(['/dashboard']);
      }
    });
  }

  protected selectRole(role: UserRole): void {
    this.role.set(role);
  }

  protected register(): void {
    this.formError.set(null);

    if (this.password() !== this.confirmPassword()) {
      this.formError.set('Las contraseñas no coinciden');
      return;
    }

    this.authStore.register({
      email: this.email().trim(),
      username: this.username().trim(),
      password: this.password(),
      role: this.role(),
    });
  }
}
