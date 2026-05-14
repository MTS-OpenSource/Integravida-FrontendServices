import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlucoseTrendsComponent } from '../glucose-trends/glucose-trends.component';
import { UpcomingDosesComponent } from '../upcoming-doses/upcoming-doses.component';
import { RecentAlertsComponent } from '../recent-alerts/recent-alerts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GlucoseTrendsComponent, UpcomingDosesComponent, RecentAlertsComponent],
  template: `
    <div class="dashboard-container">
      <h1>Resumen de Salud</h1>
      <app-glucose-trends />
      <app-upcoming-doses />
      <app-recent-alerts />
    </div>
  `,
})
export class DashboardComponent {}
