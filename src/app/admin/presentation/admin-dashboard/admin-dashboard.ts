import { Component, inject, OnInit } from '@angular/core';
import { AdminStore } from '../../application/admin.store';
import { I18nPipe } from '../../../shared/infrastructure/i18n/i18n.pipe';

@Component({
  selector: 'app-admin-dashboard',
  imports: [I18nPipe],
  template: `
    <div class="page">
      <h1>{{ 'adminDashboard.title' | i18n }}</h1>
      <p class="subtitle">{{ 'adminDashboard.subtitle' | i18n }}</p>

      @if (store.loading()) {
        <p class="loading">{{ 'adminDashboard.loading' | i18n }}</p>
      }

      @if (store.dashboardStats(); as stats) {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">{{ 'adminDashboard.totalUsers' | i18n }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.totalPatients }}</span>
            <span class="stat-label">{{ 'adminDashboard.patients' | i18n }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.totalDoctors }}</span>
            <span class="stat-label">{{ 'adminDashboard.doctors' | i18n }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .page { display: grid; gap: 1.25rem; }
    h1 { margin: 0; color: var(--foreground); font-size: clamp(1.5rem, 1.1rem + 1vw, 2.05rem); font-weight: 760; }
    .subtitle, .loading, .stat-label { color: var(--muted-foreground); }
    .subtitle { margin: 0.35rem 0 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .stat-card { min-height: 8rem; border: 1px solid rgba(255,255,255,.72); border-radius: 1.35rem; background: rgba(255,255,255,.68); box-shadow: var(--shadow-soft), inset 0 1px 0 rgba(255,255,255,.78); padding: 1.15rem; backdrop-filter: blur(20px) saturate(160%); }
    .stat-value { color: var(--primary); font-size: 2.2rem; font-weight: 820; line-height: 1; }
    .stat-label { display: block; margin-top: .55rem; font-size: .86rem; font-weight: 720; }
  `,
})
export class AdminDashboard implements OnInit {
  readonly store = inject(AdminStore);

  ngOnInit(): void {
    this.store.loadDashboard();
  }
}
