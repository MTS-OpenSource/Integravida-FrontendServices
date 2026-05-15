import { Component } from '@angular/core';

@Component({
  selector: 'app-history-chart',
  standalone: true,
  template: `<div class="chart-box">Grafico de Historial: Linea TIR/Hiper/Hipo</div>`,
  styles: [
    `
      .chart-box {
        border: 1px solid #ccc;
        padding: 10px;
      }
    `,
  ],
})
export class HistoryChartComponent {}
