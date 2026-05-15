import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-alerts',
  standalone: true,
  template: `
    <div class="alerts">
      <span class="badge">Alerta: Glucosa Alta</span>
    </div>
  `,
})
export class RecentAlertsComponent {}
