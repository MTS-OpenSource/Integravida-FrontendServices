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
  protected readonly rangePatientId = signal('');
  protected readonly glucoseLevel = signal<number | null>(null);
  protected readonly recordedAt = signal(this.toDateTimeLocalValue(new Date()));
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
    const patientId = this.rangePatientId().trim();
    const min = Number(this.minRange());
    const max = Number(this.maxRange());

    if (!patientId) {
      this.rangeError.set('Debes ingresar un Patient UUID para guardar el rango.');
      return;
    }

    if (!this.glucoseService.isValidRange(min, max)) {
      this.rangeError.set('El rango debe tener un mínimo mayor a 0 y un máximo mayor al mínimo.');
      return;
    }

    this.glucoseService.updateRange(patientId, min, max).subscribe({
      next: (range) => {
        if (!range || range.minimumValue === null || range.maximumValue === null) return;

        this.minRange.set(range.minimumValue);
        this.maxRange.set(range.maximumValue);

        this.rangeError.set(null);
      },
    });
  }

  protected loadRange(): void {
    const patientId = this.rangePatientId().trim();

    if (!patientId) {
      this.rangeError.set('Debes ingresar un Patient UUID para cargar el rango.');
      return;
    }

    this.glucoseService.loadRange(patientId).subscribe({
      next: (range) => {
        if (!range || range.minimumValue === null || range.maximumValue === null) return;

        this.minRange.set(range.minimumValue);
        this.maxRange.set(range.maximumValue);
        this.rangeError.set(null);
      },
    });
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

    const recordedAt = this.normalizeDateTimeForApi(this.recordedAt());
    const notes = this.notes().trim();

    const record = new GlucoseRecordEntity(
      '',
      patientId,
      value,
      recordedAt,
      {
        patientId,
        glucoseValue: value,
        measuredAt: recordedAt,
      },
      notes || null,
    );

    this.glucoseService.saveReading(record);

    this.glucoseLevel.set(null);
    this.notes.set('');
    this.recordedAt.set(this.toDateTimeLocalValue(new Date()));
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
