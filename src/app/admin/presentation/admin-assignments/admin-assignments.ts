import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStore } from '../../application/admin.store';

@Component({
  selector: 'app-admin-assignments',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h1>Doctor-Patient Assignments</h1>
          <p class="subtitle">Link doctors to patients</p>
        </div>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? 'Cancel' : '+ New Assignment' }}</button>
      </div>

      @if (store.error()) {
        <div class="error">{{ store.error() }}</div>
      }

      @if (showForm) {
        <div class="card">
          <h3>Create Assignment</h3>
          <div class="form-grid">
            <div class="field">
              <label>Doctor</label>
              <select [(ngModel)]="selectedDoctorId">
                <option value="">Select doctor...</option>
                @for (doctor of store.doctors(); track doctor.id) {
                  <option [value]="doctor.id">{{ doctor.doctorRecordNumber }} ({{ doctor.id }})</option>
                }
              </select>
            </div>
            <div class="field">
              <label>Patient</label>
              <select [(ngModel)]="selectedPatientId">
                <option value="">Select patient...</option>
                @for (patient of store.patients(); track patient.id) {
                  <option [value]="patient.id">{{ patient.medicalRecordNumber }} ({{ patient.id }})</option>
                }
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-primary" (click)="createAssignment()" [disabled]="store.loading()">Save</button>
            <button class="btn-secondary" (click)="showForm = false">Cancel</button>
          </div>
        </div>
      }

      @if (store.loading() && store.assignments().length === 0) {
        <p class="loading">Loading assignments...</p>
      }

      @if (store.assignments().length > 0) {
        <div class="table-card">
          <table>
            <thead>
              <tr><th>Patient ID</th><th>Doctor ID</th><th>Assigned At</th><th>Actions</th></tr>
            </thead>
            <tbody>
              @for (a of store.assignments(); track a.id) {
                <tr>
                  <td class="mono">{{ a.patientId }}</td>
                  <td class="mono">{{ a.doctorId }}</td>
                  <td>{{ a.assignedAt | date:'medium' }}</td>
                  <td>
                    <button class="btn-danger-sm" (click)="store.deleteAssignment(a.id)" [disabled]="store.loading()">Remove</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else if (!store.loading()) {
        <p class="empty">No assignments yet</p>
      }
    </div>
  `,
  styles: `
    .page { padding: 2rem; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.5rem; }
    .subtitle { color: #667085; margin: 0.25rem 0 0; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .card h3 { margin: 0 0 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.25rem; }
    .field label { font-size: 0.8rem; font-weight: 600; color: #344054; }
    .field select { border: 1px solid #d0d5dd; border-radius: 8px; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
    .form-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .btn-primary { background: #0f766e; color: #fff; border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600; }
    .btn-primary:disabled { opacity: 0.6; }
    .btn-secondary { background: #f2f4f7; color: #344054; border: 1px solid #d0d5dd; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; }
    .btn-danger-sm { background: #fef3f2; color: #b42318; border: 1px solid #fecdca; border-radius: 6px; padding: 0.3rem 0.7rem; cursor: pointer; font-size: 0.8rem; }
    .btn-danger-sm:disabled { opacity: 0.6; }
    .error { background: #fef3f2; color: #b42318; border: 1px solid #fecdca; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; }
    .loading, .empty { color: #667085; }
    .table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.75rem 1rem; background: #f9fafb; font-size: 0.75rem; text-transform: uppercase; color: #667085; letter-spacing: 0.05em; }
    td { padding: 0.75rem 1rem; border-top: 1px solid #f2f4f7; font-size: 0.875rem; }
    .mono { font-family: monospace; }
  `,
})
export class AdminAssignments implements OnInit {
  readonly store = inject(AdminStore);
  showForm = false;
  selectedDoctorId = '';
  selectedPatientId = '';

  ngOnInit(): void {
    this.store.loadAssignments();
    this.store.loadDoctors();
    this.store.loadPatients();
  }

  createAssignment(): void {
    this.store.createAssignment({
      patientId: this.selectedPatientId,
      doctorId: this.selectedDoctorId,
    });
    this.selectedDoctorId = '';
    this.selectedPatientId = '';
    this.showForm = false;
  }
}
