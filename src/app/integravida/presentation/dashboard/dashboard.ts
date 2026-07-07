import { Component, DestroyRef, computed, inject, signal, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../application/dashboard.service';
import { AuthStore } from '../../../account-management/application/auth.store';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authStore = inject(AuthStore);
  protected readonly dashboardService = inject(DashboardService);
  private readonly minutesSinceUpdate = signal(0);

  @ViewChild('trendsChart') trendsChartCanvas!: ElementRef<HTMLCanvasElement>;

  protected readonly userName = computed(() => {
    const user = this.authStore.currentUser();
    return user?.username ?? 'Patient';
  });

  ngOnInit(): void {
    this.startUpdateTimer();
  }

  ngAfterViewInit(): void {
    this.renderTrendsChart();
  }

  protected openLogReading(): void {
    // TODO: Navigate to log reading page or open modal
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
            borderColor: '#006b5f',
            backgroundColor: 'rgba(45, 212, 191, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#006b5f',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111c2d',
            titleFont: { family: 'Inter', size: 12, weight: 600 },
            bodyFont: { family: 'Inter', size: 14, weight: 700 },
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: 500 },
              color: '#94a3b8',
            },
          },
          y: {
            grid: {
              color: '#e2e8f0',
              drawTicks: false,
            },
            border: { display: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: 500 },
              color: '#94a3b8',
              padding: 8,
              stepSize: 20,
            },
            min: 60,
            max: 180,
          },
        },
      },
    });
  }

  private startUpdateTimer(): void {
    setInterval(() => {
      this.minutesSinceUpdate.update((m) => m + 1);

      if (this.minutesSinceUpdate() >= 3) {
        this.dashboardService.reload();
        this.minutesSinceUpdate.set(0);
      }
    }, 60000);
  }
}
