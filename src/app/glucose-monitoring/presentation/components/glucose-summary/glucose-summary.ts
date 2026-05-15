import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlucoseRecordEntity } from '../../../domain/model/glucose-record.entity';

@Component({
  selector: 'app-glucose-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glucose-summary.html',
  styleUrl: './glucose-summary.css',
})
export class GlucoseSummary {
  records = input.required<GlucoseRecordEntity[]>();

  protected readonly average = computed(() => {
    const vals = this.records().map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });

  protected readonly max = computed(() => {
    const vals = this.records().map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    if (vals.length === 0) return 0;
    return Math.max(...vals);
  });

  protected readonly min = computed(() => {
    const vals = this.records().map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    if (vals.length === 0) return 0;
    return Math.min(...vals);
  });

  protected readonly total = computed(() => this.records().length);

  protected readonly inRangePercent = computed(() => {
    const vals = this.records().map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    if (vals.length === 0) return 0;
    const inRange = vals.filter(v => v >= 70 && v <= 180).length;
    return Math.round((inRange / vals.length) * 100);
  });
}
