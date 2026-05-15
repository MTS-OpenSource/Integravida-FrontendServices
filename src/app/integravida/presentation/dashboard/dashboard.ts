import { Component, DestroyRef, computed, inject, signal, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../application/dashboard.service';
import { AuthStore } from '../../../account-management/application/auth.store';
import { GlucoseRecordApi } from '../../../glucose-monitoring/infrastructure/glucose-record.api';
import { GlucoseRecordEntity } from '../../../glucose-monitoring/domain/model/glucose-record.entity';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(AuthStore);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly currentDate = signal('');
  private readonly minutesSinceUpdate = signal(0);
  @ViewChild('trendsChart') trendsChartCanvas!: ElementRef<HTMLCanvasElement>;
  protected readonly lastUpdateText = computed(() => {
    const mins = this.minutesSinceUpdate();
    return mins === 0 ? 'now' : `${mins} min${mins > 1 ? 's' : ''} ago`;
  });
  ngOnInit(): void {
    this.setCurrentDate();
    this.startUpdateTimer();
  }
  ngAfterViewInit(): void {
    this.renderTrendsChart();
  }
  private renderTrendsChart(): void {
    const ctx = this.trendsChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13', 'Sat 14', 'Sun 15'],
        datasets: [
          {
            data: [110, 105, 145, 100, 130, 118, 98],
            borderColor: '#2dd4bf',
            backgroundColor: 'rgba(45, 212, 191, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }
  private setCurrentDate(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.currentDate.set(new Intl.DateTimeFormat('en-US', options).format(new Date()));
  }
  private startUpdateTimer(): void {
    setInterval(() => {
      this.minutesSinceUpdate.update((m) => m + 1);

      if (this.minutesSinceUpdate() >= 3) {
        this.refreshDashboard();
      }
    }, 60000);
  }
  protected refreshDashboard(): void {
    this.dashboardService.reload();
    this.minutesSinceUpdate.set(0);
  }
  private readonly glucoseRecordApi = inject(GlucoseRecordApi);
  private readonly router = inject(Router);

  protected readonly identifier = signal('');
  protected readonly password = signal('');
  protected readonly patientId = signal(1);
  protected readonly patientGlucoseRecords = signal<GlucoseRecordEntity[]>([
    {
      id: 1,
      recordedAt: '2025-07-15 10:00',
      glucoseLevel: 98,
      patientId: 1,
      raw: {},
    },
    {
      id: 2,
      recordedAt: '2025-07-15 14:00',
      glucoseLevel: 145,
      patientId: 1,
      raw: {},
    },
  ]);
  protected readonly patientGlucoseLoading = signal(false);
  protected readonly patientGlucoseError = signal<string | null>(null);

  protected readonly session = computed(() => this.authStore.getCurrentSession());
  protected readonly isAuthenticated = computed(() => this.authStore.isAuthenticated());
  protected readonly authLoading = computed(() => this.authStore.loading());
  protected readonly authError = computed(() => this.authStore.error());

  protected signIn(): void {
    this.authStore.signIn(this.identifier(), this.password());
  }

  protected signOut(): void {
    this.authStore.signOut();
  }

  protected reload(): void {
    this.dashboardService.reload();
  }

  protected loadPatientGlucoseRecords(): void {
    this.patientGlucoseLoading.set(true);
    this.patientGlucoseError.set(null);
    this.patientGlucoseRecords.set([]);

    this.glucoseRecordApi
      .getByPatientId(this.patientId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (records) => {
          this.patientGlucoseRecords.set(records);
          this.patientGlucoseLoading.set(false);
        },
        error: (error: unknown) => {
          this.patientGlucoseError.set(
            error instanceof Error ? error.message : 'Failed to load glucose records',
          );
          this.patientGlucoseLoading.set(false);
        },
      });
  }

  protected glucoseStatus(record: GlucoseRecordEntity): string {
    if (record.glucoseLevel === null) {
      return 'Sin dato';
    }

    if (record.glucoseLevel < 70) {
      return 'Bajo';
    }

    if (record.glucoseLevel > 180) {
      return 'Alto';
    }

    return 'Normal';
  }
}
