import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GlucoseService } from '../../application/glucose.service';
import { GlucoseRecordEntity } from '../../domain/model/glucose-record.entity';

@Component({
  selector: 'app-glucose-record-list',
  imports: [FormsModule],
  templateUrl: './glucose-record-list.html',
  styleUrl: './glucose-record-list.css',
})
export class GlucoseRecordList {
  protected readonly glucoseService = inject(GlucoseService);
  protected readonly patientId = signal(1);

  protected readonly averageLevel = computed(() => {
    const values = this.glucoseService
      .records()
      .map((record) => record.glucoseLevel)
      .filter((value): value is number => value !== null);

    if (!values.length) {
      return null;
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    return Number((total / values.length).toFixed(2));
  });

  protected loadRecords(): void {
    this.glucoseService.getReadings(this.patientId());
  }

  protected statusFor(record: GlucoseRecordEntity): string {
    if (record.glucoseLevel === null) {
      return 'Sin dato';
    }

    return this.glucoseService.evaluateRange(record.glucoseLevel);
  }
}
