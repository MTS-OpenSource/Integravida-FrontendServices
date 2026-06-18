import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';

import { AlertService } from '../../application/alert.service';

import { AlertEntity } from '../../domain/model/alert.entity';

@Component({
  selector: 'app-alerts',
  imports: [FormsModule, CommonModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts {
  protected readonly alertService = inject(AlertService);

  protected readonly patientId = signal(1);
  protected readonly selectedTab = signal<'Todas' | 'Activas' | 'Resueltas'>('Todas');

  protected loadAlerts(): void {
    this.alertService.getAlerts(this.patientId());
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
