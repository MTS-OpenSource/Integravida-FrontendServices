import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthStore } from '../../../account-management/application/auth.store';
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
  protected readonly authStore = inject(AuthStore);

  protected readonly glucoseLevel = signal<number | null>(null);
  protected readonly recordedAt = signal(this.toDateTimeLocalValue(new Date()));

  constructor() {
    effect(() => {
      const token = this.authStore.token();
      if (token) {
        this.glucoseService.loadRange(token);
      }
    });
  }

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
    this.recordedAt.set(this.toDateTimeLocalValue(new Date()));
  }

  protected save(): void {
    const value = this.glucoseLevel();
    const patientId = this.authStore.currentUser()?.patientId;

    if (!patientId || value === null || Number.isNaN(value)) return;

    const recordedAt = this.normalizeDateTimeForApi(this.recordedAt());

    const record = new GlucoseRecordEntity(
      '',
      patientId,
      value,
      recordedAt,
      {
        glucoseValue: value,
        measuredAt: recordedAt,
      },
    );

    this.glucoseService.saveReading(record);

    this.glucoseLevel.set(null);
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
