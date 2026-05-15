import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GlucoseService } from '../../application/glucose.service';
import { AuthStore } from '../../../account-management/application/auth.store';
import { GlucoseFilters } from '../components/glucose-filters/glucose-filters';
import { GlucoseSummary } from '../components/glucose-summary/glucose-summary';
import { GlucoseChart } from '../components/glucose-chart/glucose-chart';
import { GlucoseStats } from '../components/glucose-stats/glucose-stats';
import { GlucoseTable } from '../components/glucose-table/glucose-table';

@Component({
  selector: 'app-glucose-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    GlucoseFilters,
    GlucoseSummary,
    GlucoseChart,
    GlucoseStats,
    GlucoseTable,
  ],
  templateUrl: './glucose-history.html',
  styleUrl: './glucose-history.css',
})
export class GlucoseHistory implements OnInit {
  protected readonly glucoseService = inject(GlucoseService);
  protected readonly authStore = inject(AuthStore);

  ngOnInit(): void {
    const user = this.authStore.currentUser();
    if (user && user.id) {
      this.glucoseService.getReadings(user.id);
    }
  }

  protected onFilterChanged(filters: { from: Date; to: Date }): void {
    const user = this.authStore.currentUser();
    if (user && user.id) {
      this.glucoseService.getReadingsByDateRange(user.id, filters.from, filters.to);
    }
  }
}
