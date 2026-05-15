import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-glucose-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './glucose-filters.html',
  styleUrl: './glucose-filters.css',
})
export class GlucoseFilters {
  @Output() filterChanged = new EventEmitter<{ from: Date; to: Date }>();

  protected readonly fromDate = signal('2025-01-01');
  protected readonly toDate = signal('2025-05-31');
  protected readonly activePeriod = signal('ultima-semana');

  protected applyFilters(): void {
    this.filterChanged.emit({
      from: new Date(this.fromDate()),
      to: new Date(this.toDate()),
    });
  }

  protected setPeriod(period: string): void {
    this.activePeriod.set(period);
  }
}
