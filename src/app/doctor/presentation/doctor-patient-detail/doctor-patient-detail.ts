import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DoctorStore } from '../../application/doctor.store';
import { CreateTreatmentForm } from '../create-treatment-form/create-treatment-form';

@Component({
  selector: 'app-doctor-patient-detail',
  imports: [DatePipe, RouterLink, CreateTreatmentForm],
  template: `
    <div class="page">
      <a class="back" routerLink="/doctor/patients">&larr; Back to patients</a>
      <h1>Patient Detail</h1>
      <p class="mono subtitle">{{ patientId }}</p>

      @if (store.error()) {
        <div class="error">{{ store.error() }}</div>
      }

      @if (store.loading()) {
        <p class="loading">Loading...</p>
      }

      @if (store.selectedPatientSummary(); as summary) {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ summary.activeTreatments }}</span>
            <span class="stat-label">Active Treatments</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ summary.totalTreatments }}</span>
            <span class="stat-label">Total Treatments</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ summary.activeMedications }}</span>
            <span class="stat-label">Active Medications</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ summary.totalGlucoseRecords }}</span>
            <span class="stat-label">Glucose Records</span>
          </div>
        </div>
      }

      <div class="section-header">
        <h2>Treatments</h2>
        <button class="btn-primary" (click)="showTreatmentForm.set(!showTreatmentForm())">
          {{ showTreatmentForm() ? 'Cancel' : '+ New Treatment' }}
        </button>
      </div>

      @if (showTreatmentForm()) {
        <app-create-treatment-form [patientId]="patientId" />
      }

      @if (store.selectedPatientTreatments().length > 0) {
        <div class="table-card">
          <table>
            <thead>
              <tr><th>Name</th><th>Description</th><th>Start</th><th>End</th><th>Status</th></tr>
            </thead>
            <tbody>
              @for (t of store.selectedPatientTreatments(); track t.id) {
                <tr>
                  <td>{{ t.name }}</td>
                  <td>{{ t.description }}</td>
                  <td>{{ t.startDate | date:'shortDate' }}</td>
                  <td>{{ t.endDate ? (t.endDate | date:'shortDate') : '—' }}</td>
                  <td><span class="badge" [attr.data-status]="t.status">{{ t.status }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <h2>Recent Glucose Records</h2>
      @if (store.selectedPatientGlucose().length > 0) {
        <div class="table-card">
          <table>
            <thead>
              <tr><th>Value</th><th>Range</th><th>Severity</th><th>Measured At</th></tr>
            </thead>
            <tbody>
              @for (g of store.selectedPatientGlucose(); track g.id) {
                <tr>
                  <td class="mono">{{ g.glucoseValue }}</td>
                  <td>{{ g.minimumRange }} - {{ g.maximumRange }}</td>
                  <td>
                    @if (g.triggeredSeverity) {
                      <span class="badge" [attr.data-severity]="g.triggeredSeverity">{{ g.triggeredSeverity }}</span>
                    } @else {
                      <span class="badge" data-severity="NORMAL">NORMAL</span>
                    }
                  </td>
                  <td>{{ g.measuredAt | date:'medium' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else if (!store.loading()) {
        <p class="empty">No glucose records</p>
      }
    </div>
  `,
  styles: `
    .page { padding: 2rem; }
    .back { color: #0f766e; text-decoration: none; font-size: 0.875rem; display: inline-block; margin-bottom: 1rem; }
    .back:hover { text-decoration: underline; }
    h1 { margin: 0; font-size: 1.5rem; }
    h2 { font-size: 1.1rem; margin: 2rem 0 0.75rem; }
    .subtitle { color: #667085; margin: 0.25rem 0 1.5rem; }
    .loading, .empty { color: #667085; }
    .error { background: #fef3f2; color: #b42318; border: 1px solid #fecdca; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; }
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1rem;
    }
    .stat-card {
      background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem;
      display: flex; flex-direction: column; gap: 0.25rem;
    }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: #0f766e; }
    .stat-label { color: #667085; font-size: 0.8rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; }
    .section-header h2 { margin: 0; }
    .btn-primary { background: #0f766e; color: #fff; border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600; font-size: 0.85rem; }
    .table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.75rem 1rem; background: #f9fafb; font-size: 0.75rem; text-transform: uppercase; color: #667085; letter-spacing: 0.05em; }
    td { padding: 0.75rem 1rem; border-top: 1px solid #f2f4f7; font-size: 0.875rem; }
    .mono { font-family: monospace; }
    .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; }
    .badge[data-status="ACTIVE"] { background: #ecfdf3; color: #067647; }
    .badge[data-status="COMPLETED"] { background: #f2f4f7; color: #667085; }
    .badge[data-severity="CRITICAL"] { background: #fef3f2; color: #b42318; }
    .badge[data-severity="HIGH"] { background: #fef6ee; color: #b93815; }
    .badge[data-severity="MEDIUM"] { background: #fef6ee; color: #b93815; }
    .badge[data-severity="NORMAL"] { background: #ecfdf3; color: #067647; }
  `,
})
export class DoctorPatientDetail implements OnInit {
  readonly store = inject(DoctorStore);
  private readonly route = inject(ActivatedRoute);
  readonly showTreatmentForm = signal(false);
  patientId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('patientId');
    if (id) {
      this.patientId = id;
      this.store.loadPatientSummary(this.patientId);
      this.store.loadPatientGlucoseRecords(this.patientId);
      this.store.loadPatientTreatments(this.patientId);
    }
  }
}
