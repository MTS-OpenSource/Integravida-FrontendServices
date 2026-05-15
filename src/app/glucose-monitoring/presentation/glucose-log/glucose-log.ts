import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GlucoseService } from '../../application/glucose.service';
import { GlucoseRecordEntity } from '../../domain/model/glucose-record.entity';

@Component({
  selector: 'app-glucose-log',
  imports: [FormsModule],
  templateUrl: './glucose-log.html',
  styleUrl: './glucose-log.css',
})
export class GlucoseLog {
  protected readonly glucoseService = inject(GlucoseService);

  protected readonly patientId = signal(1);
  protected readonly glucoseLevel = signal<number | null>(null);
  protected readonly recordedAt = signal(new Date().toISOString().slice(0, 16));
  protected readonly notes = signal('');

  protected readonly status = computed(() => {
    const value = this.glucoseLevel();
    if (value === null || Number.isNaN(value)) return null;
    return this.glucoseService.evaluateRange(value);
  });

  protected save(): void {
    const value = this.glucoseLevel();

    if (value === null || Number.isNaN(value)) return;

    const recordedAtIso = new Date(this.recordedAt()).toISOString();

    const record = new GlucoseRecordEntity(0, this.patientId(), value, recordedAtIso, {
      patientID: this.patientId(),
      glucoseLevel: value,
      recordedAt: recordedAtIso,
      status: this.status(),
      notes: this.notes(),
    });

    this.glucoseService.saveReading(record);

    this.glucoseLevel.set(null);
    this.notes.set('');
    this.recordedAt.set(new Date().toISOString().slice(0, 16));
  }
}
