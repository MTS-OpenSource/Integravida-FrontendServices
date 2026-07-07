import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlertEntity } from '../../domain/model/alert.entity';
import { AlertService, AlertTab } from '../../application/alert.service';

@Component({
  selector: 'app-alerts',
  imports: [FormsModule, CommonModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts {
  protected readonly alertService = inject(AlertService);

  protected readonly patientId = signal('');
  protected readonly selectedTab = signal<AlertTab>('Todas');

  protected readonly settings = {
    highGlucose: true,
    lowGlucose: true,
    measurementReminders: true,
    medicationReminders: false,
  };

  protected readonly resolvedPercentage = computed(() => {
    const total = this.alertService.alerts().length;
    if (total === 0) return 0;
    return Math.round((this.alertService.resolvedAlerts().length / total) * 100);
  });

  protected readonly hasCriticalAlert = computed(() =>
    this.alertService.activeAlerts().some(
      (a) => a.severity === 'critical' || a.severity === 'Critical',
    ),
  );

  protected loadAlerts(): void {
    this.alertService.getAlerts(this.patientId(), this.selectedTab() === 'Activas');
  }

  protected setTab(tab: AlertTab): void {
    this.selectedTab.set(tab);
    this.loadAlerts();
  }

  protected dismissError(): void {
    // clear error by triggering a reload without arguments
    this.alertService.getAlerts(this.patientId());
  }

  protected toggleSetting(key: keyof typeof this.settings): void {
    this.settings[key] = !this.settings[key];
  }
}
