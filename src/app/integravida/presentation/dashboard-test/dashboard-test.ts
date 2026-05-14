import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { DashboardService } from '../../application/dashboard.service';
import { AuthStore } from '../../application/auth.store';
import { GlucoseRecordApi } from '../../infrastucture/glucose-record.api';
import { GlucoseRecordEntity } from '../../domain/model/glucose-record.entity';

@Component({
  selector: 'app-dashboard-test',
  imports: [FormsModule, JsonPipe],
  templateUrl: './dashboard-test.html',
  styleUrl: './dashboard-test.css',
})
export class DashboardTest {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(AuthStore);
  protected readonly dashboardService = inject(DashboardService);
  private readonly glucoseRecordApi = inject(GlucoseRecordApi);

  protected readonly identifier = signal('jeansusername');
  protected readonly password = signal('wO19351WD49DM');
  protected readonly patientId = signal(1);
  protected readonly patientGlucoseRecords = signal<GlucoseRecordEntity[]>([]);
  protected readonly patientGlucoseLoading = signal(false);
  protected readonly patientGlucoseError = signal<string | null>(null);

  protected readonly session = computed(() => this.authStore.getCurrentSession());

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
}
