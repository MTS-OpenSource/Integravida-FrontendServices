import { Component, input, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorStore } from '../../application/doctor.store';

@Component({
  selector: 'app-create-treatment-form',
  imports: [FormsModule],
  template: `
    <div class="card">
      <h3>New Treatment</h3>
      <div class="form-grid">
        <div class="field"><label>Name</label><input type="text" [(ngModel)]="name" placeholder="e.g. Metformin plan" /></div>
        <div class="field"><label>Start Date</label><input type="date" [(ngModel)]="startDate" /></div>
        <div class="field full"><label>Description</label><input type="text" [(ngModel)]="description" placeholder="Daily glucose control plan" /></div>
        <div class="field"><label>End Date (optional)</label><input type="date" [(ngModel)]="endDate" /></div>
      </div>
      <div class="form-actions">
        <button class="btn-primary" (click)="submit()" [disabled]="store.loading()">Save</button>
      </div>
    </div>
  `,
  styles: `
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }
    .card h3 { margin: 0 0 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .full { grid-column: 1 / -1; }
    .field { display: flex; flex-direction: column; gap: 0.25rem; }
    .field label { font-size: 0.8rem; font-weight: 600; color: #344054; }
    .field input { border: 1px solid #d0d5dd; border-radius: 8px; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
    .form-actions { margin-top: 1rem; }
    .btn-primary { background: #0f766e; color: #fff; border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600; }
    .btn-primary:disabled { opacity: 0.6; }
  `,
})
export class CreateTreatmentForm {
  readonly patientId = input.required<string>();
  readonly store = inject(DoctorStore);

  name = '';
  description = '';
  startDate = '';
  endDate = '';

  submit(): void {
    this.store.createTreatment(this.patientId(), {
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate || undefined,
    });
    this.name = '';
    this.description = '';
    this.startDate = '';
    this.endDate = '';
  }
}
