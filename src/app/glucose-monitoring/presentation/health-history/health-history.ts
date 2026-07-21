import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GlucoseService } from '../../application/glucose.service';
import { AuthStore } from '../../../account-management/application/auth.store';
import { GlucoseRecordEntity } from '../../domain/model/glucose-record.entity';
import { HistoryChartComponent } from '../../../medical-followup/presentation/components/history-chart/history-chart.component';
import { I18nPipe } from '../../../shared/infrastructure/i18n/i18n.pipe';

@Component({
  selector: 'app-health-history',
  imports: [FormsModule, RouterLink, HistoryChartComponent, DatePipe, I18nPipe],
  templateUrl: './health-history.html',
  styleUrl: './health-history.css',
})
export class HealthHistory {
  protected readonly glucoseService = inject(GlucoseService);
  private readonly authStore = inject(AuthStore);

  protected readonly fromDate = signal('');
  protected readonly toDate = signal('');

  protected readonly editingRecord = signal<GlucoseRecordEntity | null>(null);
  protected readonly editGlucoseLevel = signal<number | null>(null);
  protected readonly editRecordedAt = signal('');
  protected readonly editNotes = signal('');
  protected readonly openMenuId = signal<string | number | null>(null);

  protected readonly records = computed(() => this.glucoseService.records());

  constructor() {
    effect(() => {
      const token = this.authStore.token();
      if (token) {
        this.glucoseService.getReadings();
      }
    });
  }

  protected filterByDateRange(): void {
    if (!this.fromDate() || !this.toDate()) return;

    const from = new Date(this.fromDate());
    const to = new Date(this.toDate());

    this.glucoseService.getReadingsByDateRange(from, to);
  }

  protected filterToday(): void {
    const today = new Date();
    const from = new Date(today);
    from.setHours(0, 0, 0, 0);

    const to = new Date(today);
    to.setHours(23, 59, 59, 999);

    this.glucoseService.getReadingsByDateRange(from, to);
  }

  protected filterLast7Days(): void {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);

    this.glucoseService.getReadingsByDateRange(from, to);
  }

  protected filterLastMonth(): void {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 1);

    this.glucoseService.getReadingsByDateRange(from, to);
  }

  protected filterLast3Months(): void {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 3);

    this.glucoseService.getReadingsByDateRange(from, to);
  }

  protected filterLast6Months(): void {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 6);

    this.glucoseService.getReadingsByDateRange(from, to);
  }

  protected startEdit(record: GlucoseRecordEntity): void {
    this.editingRecord.set(record);
    this.editGlucoseLevel.set(record.glucoseLevel);
    this.editRecordedAt.set(record.recordedAt?.slice(0, 16) ?? '');
    this.editNotes.set(record.notes ?? '');
  }

  protected cancelEdit(): void {
    this.editingRecord.set(null);
    this.editGlucoseLevel.set(null);
    this.editRecordedAt.set('');
    this.editNotes.set('');
  }

  protected saveEdit(): void {
    const record = this.editingRecord();
    const value = this.editGlucoseLevel();

    if (!record || value === null || Number.isNaN(value)) return;

    const recordedAt = this.normalizeDateTimeForApi(this.editRecordedAt());
    const notes = this.editNotes().trim();

    const updatedRecord = new GlucoseRecordEntity(
      record.id,
      record.patientId,
      value,
      recordedAt,
      {
        patientId: record.patientId,
        glucoseValue: value,
        measuredAt: recordedAt,
      },
      notes || null,
    );

    this.glucoseService.updateReading(record.id, updatedRecord);
    this.cancelEdit();
  }

  protected deleteRecord(record: GlucoseRecordEntity): void {
    const confirmed = confirm('¿Seguro que deseas eliminar este registro?');
    if (!confirmed) return;

    this.glucoseService.deleteReading(record.id);
  }

  protected toggleMenu(id: string | number, event: Event): void {
    event.stopPropagation();
    this.openMenuId.set(this.openMenuId() === id ? null : id);
  }

  protected closeMenu(): void {
    this.openMenuId.set(null);
  }

  protected getStatus(record: GlucoseRecordEntity): string {
    if (record.glucoseLevel === null) return 'Sin dato';
    return this.glucoseService.evaluateRange(record.glucoseLevel);
  }

  private normalizeDateTimeForApi(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
      return this.toDateTimeLocalValue(new Date());
    }

    if (trimmed.length === 16) {
      return `${trimmed}:00`;
    }

    return trimmed.slice(0, 19);
  }

  private toDateTimeLocalValue(date: Date): string {
    const pad = (value: number): string => String(value).padStart(2, '0');

    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
