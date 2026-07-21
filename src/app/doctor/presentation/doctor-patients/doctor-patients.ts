import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DoctorStore } from '../../application/doctor.store';

@Component({
  selector: 'app-doctor-patients',
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <h1>My Patients</h1>
      <p class="subtitle">Patients assigned to you</p>

      @if (store.loading() && store.patients().length === 0) {
        <p class="loading">Loading patients...</p>
      }

      @if (store.error()) {
        <div class="error">{{ store.error() }}</div>
      }

      @if (store.patients().length > 0) {
        <div class="list">
          @for (p of store.patients(); track p.id) {
            <a class="card" [routerLink]="['/doctor/patients', p.patientId]">
              <div class="card-body">
                <div class="patient-id mono">{{ p.patientId }}</div>
                <div class="assigned">Assigned {{ p.assignedAt | date:'medium' }}</div>
              </div>
              <span class="arrow">&rsaquo;</span>
            </a>
          }
        </div>
      } @else if (!store.loading()) {
        <p class="empty">No patients assigned yet</p>
      }
    </div>
  `,
  styles: `
    .page { padding: 2rem; }
    h1 { margin: 0; font-size: 1.5rem; }
    .subtitle { color: #667085; margin: 0.25rem 0 1.5rem; }
    .loading, .empty { color: #667085; }
    .error { background: #fef3f2; color: #b42318; border: 1px solid #fecdca; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; }
    .list { display: flex; flex-direction: column; gap: 0.5rem; }
    .card {
      display: flex; align-items: center; justify-content: space-between;
      background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 1rem 1.25rem; text-decoration: none; color: inherit;
      transition: border-color 0.15s;
    }
    .card:hover { border-color: #0f766e; }
    .patient-id { font-weight: 600; font-size: 0.95rem; }
    .assigned { color: #667085; font-size: 0.8rem; margin-top: 0.25rem; }
    .arrow { font-size: 1.5rem; color: #9ca3af; }
    .mono { font-family: monospace; }
  `,
})
export class DoctorPatients implements OnInit {
  readonly store = inject(DoctorStore);

  ngOnInit(): void {
    this.store.loadMyPatients();
  }
}
