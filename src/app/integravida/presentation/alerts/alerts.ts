import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { AlertService } from '../../application/alert.service';

@Component({
  selector: 'app-alerts',
  imports: [FormsModule, JsonPipe],
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
}
