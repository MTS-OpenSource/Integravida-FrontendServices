import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-glucose-trends',
  standalone: true,
  template: `<canvas id="trendsChart">Grafico de 7 días</canvas>`,
})
export class GlucoseTrendsComponent implements OnInit {
  ngOnInit(): void {
  }
}
