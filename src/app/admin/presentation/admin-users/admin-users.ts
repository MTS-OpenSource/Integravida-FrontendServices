import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStore } from '../../application/admin.store';
import { I18nPipe } from '../../../shared/infrastructure/i18n/i18n.pipe';

@Component({
  selector: 'app-admin-users',
  imports: [FormsModule, DatePipe, I18nPipe],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h1>{{ 'adminUsers.title' | i18n }}</h1>
          <p class="subtitle">{{ 'adminUsers.subtitle' | i18n }}</p>
        </div>
        <div class="actions">
          <button class="btn-primary" (click)="showCreate.set('doctor')">{{ 'adminUsers.newDoctor' | i18n }}</button>
          <button class="btn-secondary" (click)="showCreate.set('admin')">{{ 'adminUsers.newAdmin' | i18n }}</button>
        </div>
      </div>

      @if (store.error()) {
        <div class="error">{{ store.error() }}</div>
      }

      @if (showCreate() === 'doctor') {
        <div class="card">
          <h3>{{ 'adminUsers.createDoctor' | i18n }}</h3>
          <div class="form-grid">
            <div class="field"><label>{{ 'adminUsers.username' | i18n }}</label><input type="text" [(ngModel)]="doctorForm.username" /></div>
            <div class="field"><label>{{ 'adminUsers.email' | i18n }}</label><input type="email" [(ngModel)]="doctorForm.email" /></div>
            <div class="field"><label>{{ 'adminUsers.password' | i18n }}</label><input type="password" [(ngModel)]="doctorForm.password" /></div>
            <div class="field"><label>{{ 'adminUsers.firstName' | i18n }}</label><input type="text" [(ngModel)]="doctorForm.firstName" /></div>
            <div class="field"><label>{{ 'adminUsers.lastName' | i18n }}</label><input type="text" [(ngModel)]="doctorForm.lastName" /></div>
            <div class="field"><label>{{ 'adminUsers.phone' | i18n }}</label><input type="text" [(ngModel)]="doctorForm.phoneNumber" /></div>
            <div class="field"><label>{{ 'adminUsers.dateOfBirth' | i18n }}</label><input type="date" [(ngModel)]="doctorForm.dateOfBirth" /></div>
            <div class="field"><label>{{ 'adminUsers.recordNumber' | i18n }}</label><input type="text" [(ngModel)]="doctorForm.doctorRecordNumber" /></div>
            <div class="field full"><label>{{ 'adminUsers.notes' | i18n }}</label><input type="text" [(ngModel)]="doctorForm.doctorNotes" /></div>
          </div>
          <div class="form-actions">
            <button class="btn-primary" (click)="createDoctor()" [disabled]="store.loading()">{{ 'adminUsers.save' | i18n }}</button>
            <button class="btn-secondary" (click)="showCreate.set(null)">{{ 'adminUsers.cancel' | i18n }}</button>
          </div>
        </div>
      }

      @if (showCreate() === 'admin') {
        <div class="card">
          <h3>{{ 'adminUsers.createAdmin' | i18n }}</h3>
          <div class="form-grid">
            <div class="field"><label>{{ 'adminUsers.username' | i18n }}</label><input type="text" [(ngModel)]="adminForm.username" /></div>
            <div class="field"><label>{{ 'adminUsers.email' | i18n }}</label><input type="email" [(ngModel)]="adminForm.email" /></div>
            <div class="field"><label>{{ 'adminUsers.password' | i18n }}</label><input type="password" [(ngModel)]="adminForm.password" /></div>
            <div class="field"><label>{{ 'adminUsers.firstName' | i18n }}</label><input type="text" [(ngModel)]="adminForm.firstName" /></div>
            <div class="field"><label>{{ 'adminUsers.lastName' | i18n }}</label><input type="text" [(ngModel)]="adminForm.lastName" /></div>
            <div class="field"><label>{{ 'adminUsers.phone' | i18n }}</label><input type="text" [(ngModel)]="adminForm.phoneNumber" /></div>
            <div class="field"><label>{{ 'adminUsers.dateOfBirth' | i18n }}</label><input type="date" [(ngModel)]="adminForm.dateOfBirth" /></div>
          </div>
          <div class="form-actions">
            <button class="btn-primary" (click)="createAdmin()" [disabled]="store.loading()">{{ 'adminUsers.save' | i18n }}</button>
            <button class="btn-secondary" (click)="showCreate.set(null)">{{ 'adminUsers.cancel' | i18n }}</button>
          </div>
        </div>
      }

      @if (store.loading() && store.users().length === 0) {
        <p class="loading">{{ 'adminUsers.loading' | i18n }}</p>
      }

      @if (store.users().length > 0) {
        <div class="table-card">
          <table>
            <thead>
              <tr><th>{{ 'adminUsers.username' | i18n }}</th><th>{{ 'adminUsers.email' | i18n }}</th><th>Role</th><th>Created</th></tr>
            </thead>
            <tbody>
              @for (user of store.users(); track user.id) {
                <tr>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td><span class="badge" [attr.data-role]="user.role">{{ user.role }}</span></td>
                  <td>{{ user.createdAt | date:'short' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: `
    .page { padding: 2rem; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.5rem; }
    .subtitle { color: #667085; margin: 0.25rem 0 0; }
    .actions { display: flex; gap: 0.5rem; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .card h3 { margin: 0 0 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .full { grid-column: 1 / -1; }
    .field { display: flex; flex-direction: column; gap: 0.25rem; }
    .field label { font-size: 0.8rem; font-weight: 600; color: #344054; }
    .field input { border: 1px solid #d0d5dd; border-radius: 8px; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
    .form-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .btn-primary { background: #0f766e; color: #fff; border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600; }
    .btn-primary:disabled { opacity: 0.6; }
    .btn-secondary { background: #f2f4f7; color: #344054; border: 1px solid #d0d5dd; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; }
    .error { background: #fef3f2; color: #b42318; border: 1px solid #fecdca; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; }
    .loading { color: #667085; }
    .table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.75rem 1rem; background: #f9fafb; font-size: 0.75rem; text-transform: uppercase; color: #667085; letter-spacing: 0.05em; }
    td { padding: 0.75rem 1rem; border-top: 1px solid #f2f4f7; font-size: 0.875rem; }
    .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; }
    .badge[data-role="ADMIN"] { background: #fef3f2; color: #b42318; }
    .badge[data-role="DOCTOR"] { background: #ecfdf3; color: #067647; }
    .badge[data-role="PATIENT"] { background: #eff4ff; color: #3e5fc0; }
  `,
})
export class AdminUsers implements OnInit {
  readonly store = inject(AdminStore);
  readonly showCreate = signal<'doctor' | 'admin' | null>(null);

  doctorForm = {
    username: '', email: '', password: '', firstName: '', lastName: '',
    phoneNumber: '', dateOfBirth: '', doctorRecordNumber: '', doctorNotes: '',
  };

  adminForm = {
    username: '', email: '', password: '', firstName: '', lastName: '',
    phoneNumber: '', dateOfBirth: '',
  };

  ngOnInit(): void {
    this.store.loadUsers();
  }

  createDoctor(): void {
    this.store.createDoctor(this.doctorForm);
    this.showCreate.set(null);
    this.doctorForm = {
      username: '', email: '', password: '', firstName: '', lastName: '',
      phoneNumber: '', dateOfBirth: '', doctorRecordNumber: '', doctorNotes: '',
    };
  }

  createAdmin(): void {
    this.store.createAdmin(this.adminForm);
    this.showCreate.set(null);
    this.adminForm = {
      username: '', email: '', password: '', firstName: '', lastName: '',
      phoneNumber: '', dateOfBirth: '',
    };
  }
}
