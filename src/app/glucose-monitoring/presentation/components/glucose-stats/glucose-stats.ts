import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlucoseRecordEntity } from '../../../domain/model/glucose-record.entity';

@Component({
  selector: 'app-glucose-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glucose-stats.html',
  styleUrl: './glucose-stats.css',
})
export class GlucoseStats {
  records = input.required<GlucoseRecordEntity[]>();

  protected readonly timeInRange = computed(() => {
    const vals = this.records().map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    if (vals.length === 0) return 0;
    const inRange = vals.filter(v => v >= 70 && v <= 180).length;
    return Math.round((inRange / vals.length) * 100);
  });

  protected readonly hyperglycemia = computed(() => {
    const vals = this.records().map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    if (vals.length === 0) return 0;
    const high = vals.filter(v => v > 180).length;
    return Math.round((high / vals.length) * 100);
  });

  protected readonly hypoglycemia = computed(() => {
    const vals = this.records().map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    if (vals.length === 0) return 0;
    const low = vals.filter(v => v < 70).length;
    return Math.round((low / vals.length) * 100);
  });

  protected readonly variability = computed(() => {
    const vals = this.records().map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    if (vals.length <= 1) return 0;
    
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const squareDiffs = vals.map(v => Math.pow(v - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);
    
    return Math.round((stdDev / mean) * 100);
  });
}
