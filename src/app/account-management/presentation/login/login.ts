import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../application/auth.store';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly identifier = signal('');
  protected readonly password = signal('');

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        void this.router.navigate(['/dashboard']);
      }
    });
  }

  protected signIn(): void {
    this.authStore.signIn(this.identifier().trim(), this.password());
  }
}
