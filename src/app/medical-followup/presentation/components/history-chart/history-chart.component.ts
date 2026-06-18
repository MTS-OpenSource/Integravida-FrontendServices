import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlucoseRecordEntity } from '../../../../glucose-monitoring/domain/model/glucose-record.entity';

@Component({
  selector: 'app-history-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-container">
      <div class="stats-grid">
        <div class="stat-card tir">
          <h3>Time In Range (TIR)</h3>
          <p class="stat-value">{{ tirPercentage | number: '1.0-1' }}%</p>
          <span class="stat-desc">Rango Normal (70-180 mg/dL)</span>
        </div>
        <div class="stat-card hyper">
          <h3>Hiperglucemia</h3>
          <p class="stat-value">{{ hyperPercentage | number: '1.0-1' }}%</p>
          <span class="stat-desc">Valores > 180 mg/dL</span>
        </div>
        <div class="stat-card hypo">
          <h3>Hipoglucemia</h3>
          <p class="stat-value">{{ hypoPercentage | number: '1.0-1' }}%</p>
          <span class="stat-desc">Valores < 70 mg/dL</span>
        </div>
        <div class="stat-card cv">
          <h3>Variabilidad (CV)</h3>
          <p class="stat-value">{{ cv | number: '1.0-1' }}%</p>
          <span class="stat-desc">Estabilidad metabólica</span>
        </div>
      </div>

      <div class="chart-wrapper">
        <h3>Gráfico de evolución temporal</h3>
        <div class="svg-container" *ngIf="records && records.length > 0; else emptyChart">
          <svg viewBox="0 0 800 250" class="evolution-svg">
            <line
              x1="0"
              y1="58"
              x2="800"
              y2="58"
              class="guide-line high-target"
              stroke-dasharray="4"
            />
            <text x="10" y="52" class="guide-text">Límite Hiper (180 mg/dL)</text>

            <line
              x1="0"
              y1="183"
              x2="800"
              y2="183"
              class="guide-line low-target"
              stroke-dasharray="4"
            />
            <text x="10" y="177" class="guide-text">Límite Hipo (70 mg/dL)</text>

            <path
              [attr.d]="svgPath"
              fill="none"
              stroke="#2563eb"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <circle
              *ngFor="let pt of chartPoints"
              [attr.cx]="pt.x"
              [attr.cy]="pt.y"
              r="5"
              [attr.fill]="pt.color"
              class="chart-dot"
            >
              <title>Glucosa: {{ pt.value }} mg/dL</title>
            </circle>
          </svg>
        </div>
        <ng-template #emptyChart>
          <p class="empty-msg">
            No hay suficientes datos disponibles para trazar el gráfico de evolución.
          </p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .analytics-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 25px;
        font-family: system-ui, sans-serif;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }
      .stat-card {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }
      .stat-card h3 {
        margin: 0;
        font-size: 0.9rem;
        color: #64748b;
        font-weight: 600;
      }
      .stat-value {
        margin: 8px 0 4px 0;
        font-size: 1.8rem;
        font-weight: 700;
      }
      .stat-desc {
        font-size: 0.75rem;
        color: #94a3b8;
      }
      .tir .stat-value {
        color: #16a34a;
      }
      .hyper .stat-value {
        color: #dc2626;
      }
      .hypo .stat-value {
        color: #ea580c;
      }
      .cv .stat-value {
        color: #2563eb;
      }
      .chart-wrapper {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
        border: 1px solid #e2e8f0;
      }
      .chart-wrapper h3 {
        margin: 0 0 15px 0;
        font-size: 1rem;
        color: #1e293b;
      }
      .svg-container {
        background: #f8fafc;
        border-radius: 8px;
        padding: 10px;
        border: 1px solid #f1f5f9;
      }
      .guide-line {
        stroke: #cbd5e1;
        stroke-width: 1;
      }
      .guide-text {
        font-size: 10px;
        fill: #94a3b8;
        font-weight: 500;
      }
      .chart-dot {
        cursor: pointer;
      }
      .chart-dot:hover {
        stroke: #000000;
        stroke-width: 2px;
      }
      .empty-msg {
        text-align: center;
        color: #94a3b8;
        padding: 40px 0;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class HistoryChartComponent implements OnChanges {
  @Input() records: GlucoseRecordEntity[] = [];

  // Variables estadísticas
  protected tirPercentage = 0;
  protected hyperPercentage = 0;
  protected hypoPercentage = 0;
  protected cv = 0;

  // Variables de Renderizado SVG
  protected svgPath = '';
  protected chartPoints: Array<{ x: number; y: number; value: number; color: string }> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['records']) {
      this.calculateMetricsAndChart();
    }
  }

  private calculateMetricsAndChart(): void {
    if (!this.records || this.records.length === 0) {
      this.resetMetrics();
      return;
    }

    // Filtramos los registros para asegurar que glucoseLevel NO sea null ni undefined
    const validRecords = this.records.filter(
      (r): r is GlucoseRecordEntity & { glucoseLevel: number } =>
        r.glucoseLevel !== null && r.glucoseLevel !== undefined,
    );

    if (validRecords.length === 0) {
      this.resetMetrics();
      return;
    }

    const total = validRecords.length;
    let normalCount = 0;
    let hyperCount = 0;
    let hypoCount = 0;
    let sum = 0;

    // 1. Clasificación y promedio con datos 100% seguros
    validRecords.forEach((r) => {
      const val = r.glucoseLevel;
      sum += val;
      if (val < 70) hypoCount++;
      else if (val > 180) hyperCount++;
      else normalCount++;
    });

    this.tirPercentage = (normalCount / total) * 100;
    this.hyperPercentage = (hyperCount / total) * 100;
    this.hypoPercentage = (hypoCount / total) * 100;

    const mean = sum / total;

    // 2. Cálculo del Desviación Estándar y Coeficiente de Variación (CV)
    let varianceSum = 0;
    validRecords.forEach((r) => {
      varianceSum += Math.pow(r.glucoseLevel - mean, 2);
    });
    const standardDeviation = Math.sqrt(varianceSum / total);
    this.cv = mean > 0 ? (standardDeviation / mean) * 100 : 0;

    // 3. Generar el Path Lineal SVG de evolución temporal
    this.generateSvgPath(validRecords);
  }

  private generateSvgPath(
    validRecords: Array<GlucoseRecordEntity & { glucoseLevel: number }>,
  ): void {
    // Ordenamos cronológicamente
    const sorted = [...validRecords].sort((a, b) => {
      return new Date(a.recordedAt || '').getTime() - new Date(b.recordedAt || '').getTime();
    });

    const width = 800;
    const height = 250;
    const padding = 30;

    const minGlucose = 40;
    const maxGlucose = 240;

    this.chartPoints = sorted.map((r, i) => {
      const x =
        sorted.length > 1 ? padding + (i * (width - padding * 2)) / (sorted.length - 1) : width / 2;
      const clampedVal = Math.max(minGlucose, Math.min(maxGlucose, r.glucoseLevel));
      const y =
        height -
        padding -
        ((clampedVal - minGlucose) * (height - padding * 2)) / (maxGlucose - minGlucose);

      let color = '#16a34a'; // Normal
      if (r.glucoseLevel < 70)
        color = '#ea580c'; // Bajo
      else if (r.glucoseLevel > 180) color = '#dc2626'; // Alto

      return { x, y, value: r.glucoseLevel, color };
    });

    if (this.chartPoints.length > 0) {
      this.svgPath = this.chartPoints.reduce((path, pt, i) => {
        return i === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
      }, '');
    } else {
      this.svgPath = '';
    }
  }

  private resetMetrics(): void {
    this.tirPercentage = 0;
    this.hyperPercentage = 0;
    this.hypoPercentage = 0;
    this.cv = 0;
    this.svgPath = '';
    this.chartPoints = [];
  }
}
