import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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

  protected readonly patientId = signal('');

  ngOnInit(): void {
    const currentPatientId = this.patientId().trim();
    if (currentPatientId) {
      this.glucoseService.getReadings(currentPatientId);
    }
  }

  protected loadRecords(): void {
    this.glucoseService.getReadings(this.patientId());
  }

  protected onFilterChanged(filters: { from: Date; to: Date }): void {
    this.glucoseService.getReadingsByDateRange(this.patientId(), filters.from, filters.to);
  }
}
