import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlucoseRecordEntity } from '../../../domain/model/glucose-record.entity';

@Component({
  selector: 'app-glucose-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glucose-chart.html',
  styleUrl: './glucose-chart.css',
})
export class GlucoseChart {
  records = input.required<GlucoseRecordEntity[]>();

  protected readonly chartData = computed(() => {
    const raw = [...this.records()].reverse(); // Oldest to newest for the chart
    const vals = raw.map(r => r.glucoseLevel).filter((v): v is number => v !== null);
    
    if (vals.length === 0) return { points: '', dots: [] };

    const width = 800;
    const height = 200;
    const padding = 20;
    
    const maxVal = 250; // Fixed max for consistency
    const minVal = 0;

    const xScale = (width - padding * 2) / (vals.length - 1 || 1);
    const yScale = (height - padding * 2) / (maxVal - minVal);

    const points = vals.map((v, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (v - minVal) * yScale;
      return `${x},${y}`;
    }).join(' ');

    const dots = vals.map((v, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (v - minVal) * yScale;
      return { x, y, value: v };
    });

    return { points, dots };
  });

  protected readonly limitY = computed(() => {
    const maxVal = 250;
    const height = 200;
    const padding = 20;
    const yScale = (height - padding * 2) / maxVal;
    
    return {
      upper: height - padding - 180 * yScale,
      lower: height - padding - 70 * yScale
    };
  });
}
