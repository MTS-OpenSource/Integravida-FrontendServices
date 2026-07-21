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
    .page { padding: 2rem; }
    h1 { margin: 0; font-size: 1.5rem; }
    .subtitle { color: #667085; margin: 0.25rem 0 1.5rem; }
    .loading { color: #667085; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .stat-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .stat-value { font-size: 2rem; font-weight: 700; color: #0f766e; }
    .stat-label { color: #667085; font-size: 0.875rem; }
  `,
})
export class AdminDashboard implements OnInit {
  readonly store = inject(AdminStore);

  ngOnInit(): void {
    this.store.loadDashboard();
  }
}
