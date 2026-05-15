import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlucoseRecordEntity } from '../../../domain/model/glucose-record.entity';
import { GlucoseService } from '../../../application/glucose.service';

@Component({
  selector: 'app-glucose-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glucose-table.html',
  styleUrl: './glucose-table.css',
})
export class GlucoseTable {
  private readonly glucoseService = inject(GlucoseService);
  records = input.required<GlucoseRecordEntity[]>();

  protected getStatus(value: number | null): string {
    if (value === null) return 'Desconocido';
    return this.glucoseService.evaluateRange(value);
  }

  protected getStatusClass(value: number | null): string {
    const status = this.getStatus(value);
    return status.toLowerCase();
  }

  protected formatDate(dateStr: string | null): string {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  protected formatTime(dateStr: string | null): string {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  protected getDayName(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'long' });
  }
}
