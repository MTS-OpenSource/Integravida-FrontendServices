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

  protected readonly patientId = signal('');
  protected readonly glucoseLevel = signal<number | null>(null);
  protected readonly recordedAt = signal(new Date().toISOString().slice(0, 16));
  protected readonly notes = signal('');

  protected readonly minRange = signal(this.glucoseService.range().min);
  protected readonly maxRange = signal(this.glucoseService.range().max);
  protected readonly rangeError = signal<string | null>(null);
  protected readonly currentRange = computed(() => this.glucoseService.range());

  protected readonly status = computed(() => {
    const value = this.glucoseLevel();
    if (value === null || Number.isNaN(value)) return null;
    return this.glucoseService.evaluateRange(value, this.currentRange());
  });

  protected saveRange(): void {
    const min = Number(this.minRange());
    const max = Number(this.maxRange());

    if (!this.glucoseService.isValidRange(min, max)) {
      this.rangeError.set('El rango debe tener un mínimo mayor a 0 y un máximo mayor al mínimo.');
      return;
    }

    this.glucoseService.updateRange(min, max);
    this.rangeError.set(null);
  }

  protected resetRange(): void {
    this.glucoseService.resetRange();
    this.minRange.set(this.glucoseService.range().min);
    this.maxRange.set(this.glucoseService.range().max);
    this.rangeError.set(null);
  }

  protected save(): void {
    const value = this.glucoseLevel();
    const patientId = this.patientId().trim();

    if (!patientId || value === null || Number.isNaN(value)) return;

    const recordedAtIso = new Date(this.recordedAt()).toISOString();
    const notes = this.notes().trim();

    const record = new GlucoseRecordEntity(
      '',
      patientId,
      value,
      recordedAtIso,
      {
        patientId,
        glucoseValue: value,
        measuredAt: recordedAtIso,
      },
      notes || null,
    );

    this.glucoseService.saveReading(record);

    this.glucoseLevel.set(null);
    this.notes.set('');
    this.recordedAt.set(new Date().toISOString().slice(0, 16));
  }
}
