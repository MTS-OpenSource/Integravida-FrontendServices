import { Component, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStore } from '../../application/auth.store';
import { UserRole } from '../../domain/model/user.entity';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly activeTab = signal<'login' | 'signup'>('login');
  
  // Shared signals
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);

  // Register specific signals
  protected readonly role = signal<UserRole>('Patient');
  protected readonly username = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly formError = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.authStore.currentUser()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  protected signIn(): void {
    if (!this.email() || !this.password()) return;
    this.authStore.signIn(this.email(), this.password());
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

  protected selectRole(role: UserRole): void {
    this.role.set(role);
  }

  protected navigateToForgetPassword(): void {
    this.router.navigate(['/forget']);
  }
}
