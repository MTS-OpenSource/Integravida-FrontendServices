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
  protected readonly recordedAt = signal(this.toDateTimeLocalValue(new Date()));
  protected readonly notes = signal('');
  protected readonly patientState = signal('Antes de comer');

  protected readonly status = computed(() => {
    const value = this.glucoseLevel();
    if (value === null || Number.isNaN(value)) return null;
    return this.glucoseService.evaluateRange(value);
  });

  protected readonly recordedAtDate = computed(() => this.recordedAt().slice(0, 10));

  protected readonly recordedAtTime = computed(() => this.recordedAt().slice(11, 16));

  protected readonly currentDateLabel = computed(() => {
    const now = new Date();
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const wd = weekdays[now.getDay()];
    const d = now.getDate();
    const m = months[now.getMonth()];
    const y = now.getFullYear();
    return `${wd}, ${d} de ${m} de ${y}`;
  });

  protected onDateChange(value: string): void {
    const time = this.recordedAtTime();
    this.recordedAt.set(`${value}T${time}`);
  }

  protected onTimeChange(value: string): void {
    const date = this.recordedAtDate();
    this.recordedAt.set(`${date}T${value}`);
  }

  protected resetForm(): void {
    this.glucoseLevel.set(null);
    this.notes.set('');
    this.patientState.set('Antes de comer');
    this.recordedAt.set(this.toDateTimeLocalValue(new Date()));
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
        patientState: this.patientState(),
      },
      notes || null,
    );

    this.glucoseService.saveReading(record);

    this.glucoseLevel.set(null);
    this.notes.set('');
    this.patientState.set('Antes de comer');
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
