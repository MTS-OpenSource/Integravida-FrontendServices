import { Component, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStore } from '../../application/auth.store';

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
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);

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

  protected navigateToForgetPassword(): void {
    this.router.navigate(['/forget']);
  }
}
