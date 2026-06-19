import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

import { AlertEntity } from '../../domain/model/alert.entity';
import { AlertService, AlertTab } from '../../application/alert.service';

@Component({
  selector: 'app-alerts',
  imports: [FormsModule, JsonPipe, CommonModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts {
  protected readonly alertService = inject(AlertService);

  protected readonly patientId = signal('');
  protected readonly selectedTab = signal<AlertTab>('Todas');

  protected loadAlerts(): void {
    this.alertService.getAlerts(this.patientId(), this.selectedTab() === 'Activas');
  }

  protected setTab(tab: AlertTab): void {
    this.selectedTab.set(tab);
    this.loadAlerts();
  }

  protected visibleAlerts() {
    if (this.selectedTab() === 'Activas') return this.alertService.activeAlerts();
    if (this.selectedTab() === 'Resueltas') return this.alertService.resolvedAlerts();
    return this.alertService.alerts();
  }

  protected markAsRead(alert: AlertEntity): void {
    this.alertService.markAsRead(alert);
  }

  protected markAllAsRead(): void {
    this.alertService.markAllAsRead();
  }
}
