import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GlucoseService } from '../../application/glucose.service';
import { GlucoseRecordEntity } from '../../domain/model/glucose-record.entity';

@Component({
  selector: 'app-health-history',
  imports: [FormsModule],
  templateUrl: './health-history.html',
  styleUrl: './health-history.css',
})
export class HealthHistory {
  protected readonly glucoseService = inject(GlucoseService);

  protected readonly patientId = signal(1);
  protected readonly fromDate = signal('');
  protected readonly toDate = signal('');

  protected readonly editingRecord = signal<GlucoseRecordEntity | null>(null);
  protected readonly editGlucoseLevel = signal<number | null>(null);
  protected readonly editRecordedAt = signal('');
  protected readonly editNotes = signal('');

  protected readonly records = computed(() => this.glucoseService.records());

  protected loadRecords(): void {
    this.glucoseService.getReadings(this.patientId());
  }

  protected filterByDateRange(): void {
    if (!this.fromDate() || !this.toDate()) return;

    const from = new Date(this.fromDate());
    const to = new Date(this.toDate());

    this.glucoseService.getReadingsByDateRange(this.patientId(), from, to);
  }

  protected filterToday(): void {
    const today = new Date();
    const from = new Date(today);
    from.setHours(0, 0, 0, 0);

    const to = new Date(today);
    to.setHours(23, 59, 59, 999);

    this.glucoseService.getReadingsByDateRange(this.patientId(), from, to);
  }

  protected filterLast7Days(): void {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);

    this.glucoseService.getReadingsByDateRange(this.patientId(), from, to);
  }

  protected startEdit(record: GlucoseRecordEntity): void {
    this.editingRecord.set(record);
    this.editGlucoseLevel.set(record.glucoseLevel);
    this.editRecordedAt.set(record.recordedAt?.slice(0, 16) ?? '');
    this.editNotes.set(String(record.raw['notes'] ?? ''));
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

    const recordedAtIso = new Date(this.editRecordedAt()).toISOString();

    const updatedRecord = new GlucoseRecordEntity(
      record.id,
      record.patientId,
      value,
      recordedAtIso,
      {
        ...record.raw,
        patientID: record.patientId,
        glucoseLevel: value,
        recordedAt: recordedAtIso,
        status: this.glucoseService.evaluateRange(value),
        notes: this.editNotes(),
      },
    );

    this.glucoseService.updateReading(record.id, updatedRecord);
    this.cancelEdit();
  }

  protected deleteRecord(record: GlucoseRecordEntity): void {
    const confirmed = confirm('¿Seguro que deseas eliminar este registro?');
    if (!confirmed) return;

    this.glucoseService.deleteReading(record.id);
  }

  protected getStatus(record: GlucoseRecordEntity): string {
    if (record.glucoseLevel === null) return 'Sin dato';
    return this.glucoseService.evaluateRange(record.glucoseLevel);
  }
}
