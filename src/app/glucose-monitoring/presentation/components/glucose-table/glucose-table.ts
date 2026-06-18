import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlucoseRecordEntity } from '../../../domain/model/glucose-record.entity';
import { GlucoseService } from '../../../application/glucose.service';

@Component({
  selector: 'app-glucose-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './glucose-table.html',
  styleUrl: './glucose-table.css',
})
export class GlucoseTable {
  private readonly glucoseService = inject(GlucoseService);
  records = input.required<GlucoseRecordEntity[]>();

  protected readonly isEditModalOpen = signal(false);
  protected readonly recordToEdit = signal<GlucoseRecordEntity | null>(null);
  protected readonly editGlucoseValue = signal<number | null>(null);
  protected readonly editDateValue = signal('');
  protected readonly editNotesValue = signal('');

  protected readonly isDeleteModalOpen = signal(false);
  protected readonly recordToDelete = signal<number | null>(null);

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

  protected openEditModal(record: GlucoseRecordEntity): void {
    this.recordToEdit.set(record);
    this.editGlucoseValue.set(record.glucoseLevel);
    this.editDateValue.set(record.recordedAt ? record.recordedAt.slice(0, 16) : '');
    this.editNotesValue.set(String(record.raw['notes'] ?? ''));
    this.isEditModalOpen.set(true);
  }

  protected closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.recordToEdit.set(null);
  }

  protected confirmEdit(): void {
    const currentRecord = this.recordToEdit();
    const newValue = this.editGlucoseValue();

    if (!currentRecord || newValue === null || Number.isNaN(newValue)) return;

    const updatedDateIso = new Date(this.editDateValue()).toISOString();

    const updatedEntity = new GlucoseRecordEntity(
      currentRecord.id,
      currentRecord.patientId,
      newValue,
      updatedDateIso,
      {
        ...currentRecord.raw,
        patientId: currentRecord.patientId,
        glucoseLevel: newValue,
        recordedAt: updatedDateIso,
        status: this.glucoseService.evaluateRange(newValue),
        notes: this.editNotesValue(),
      },
    );

    this.glucoseService.updateReading(currentRecord.id, updatedEntity);
    this.closeEditModal();
  }

  protected openDeleteModal(recordId: number): void {
    this.recordToDelete.set(recordId);
    this.isDeleteModalOpen.set(true);
  }

  protected closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.recordToDelete.set(null);
  }

  protected confirmDelete(): void {
    const id = this.recordToDelete();
    if (id !== null) {
      this.glucoseService.deleteReading(id);
      this.closeDeleteModal();
    }
  }
}
