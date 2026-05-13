import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { DashboardService } from '../../application/dashboard.service';
import { AuthStore } from '../../application/auth.store';

@Component({
  selector: 'app-dashboard-test',
  imports: [FormsModule, JsonPipe],
  templateUrl: './dashboard-test.html',
  styleUrl: './dashboard-test.css',
})
export class DashboardTest {
  private readonly authStore = inject(AuthStore);
  protected readonly dashboardService = inject(DashboardService);

  protected readonly identifier = signal('jeansusername');
  protected readonly password = signal('wO19351WD49DM');

  protected readonly session = computed(() => this.authStore.getCurrentSession());

  protected signIn(): void {
    this.authStore.signIn(this.identifier(), this.password());
  }

  protected signOut(): void {
    this.authStore.signOut();
  }

  protected reload(): void {
    this.dashboardService.reload();
  }
}
