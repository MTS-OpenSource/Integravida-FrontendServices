import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DashboardService } from '../../application/dashboard.service';
import { AuthStore } from '../../../account-management/application/auth.store';
import { GlucoseRecordApi } from '../../../glucose-monitoring/infrastructure/glucose-record.api';
import { GlucoseRecordEntity } from '../../../glucose-monitoring/domain/model/glucose-record.entity';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(AuthStore);
  protected readonly dashboardService = inject(DashboardService);
  private readonly glucoseRecordApi = inject(GlucoseRecordApi);
  private readonly router = inject(Router);

  protected readonly identifier = signal('');
  protected readonly password = signal('');
  protected readonly patientId = signal(1);
  protected readonly patientGlucoseRecords = signal<GlucoseRecordEntity[]>([]);
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
