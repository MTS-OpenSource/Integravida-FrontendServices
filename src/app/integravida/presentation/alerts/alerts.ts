import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthStore } from '../../../account-management/application/auth.store';
import { AlertService, AlertTab } from '../../application/alert.service';

@Component({
  selector: 'app-alerts',
  imports: [FormsModule, CommonModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts {
  protected readonly alertService = inject(AlertService);
  protected readonly authStore = inject(AuthStore);

  protected readonly selectedTab = signal<AlertTab>('Todas');

  constructor() {
    effect(() => {
      const token = this.authStore.token();
      if (token) {
        this.alertService.getAlerts(token, this.selectedTab() === 'Activas');
      }
    });
  }

  protected loadAlerts(): void {
    const token = this.authStore.token();
    if (token) {
      this.alertService.getAlerts(token, this.selectedTab() === 'Activas');
    }
  }

  protected setTab(tab: AlertTab): void {
    this.selectedTab.set(tab);
    this.loadAlerts();
  }

  protected dismissError(): void {
    const token = this.authStore.token();
    if (token) {
      this.alertService.getAlerts(token);
    }
  }
}
