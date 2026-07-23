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
    .page { display: grid; gap: 1rem; }
    .header { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; }
    h1 { margin: 0; color: var(--foreground); font-size: clamp(1.5rem, 1.1rem + 1vw, 2.05rem); font-weight: 760; }
    .subtitle, .loading { color: var(--muted-foreground); margin: .35rem 0 0; }
    .actions, .form-actions { display: flex; flex-wrap: wrap; gap: .6rem; }
    .card, .table-card { border: 1px solid rgba(255,255,255,.72); border-radius: 1.35rem; background: rgba(255,255,255,.68); box-shadow: var(--shadow-soft), inset 0 1px 0 rgba(255,255,255,.78); backdrop-filter: blur(20px) saturate(160%); }
    .card { padding: 1.15rem; }
    .card h3 { margin: 0 0 1rem; color: var(--foreground); }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .full { grid-column: 1 / -1; }
    .field { display: grid; gap: .4rem; }
    .field label { color: var(--muted-foreground); font-size: .78rem; font-weight: 800; }
    .field input { border: 1px solid var(--input); border-radius: .9rem; background: rgba(255,255,255,.68); color: var(--foreground); outline: none; padding: .76rem .9rem; }
    .field input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--ring); }
    .btn-primary, .btn-secondary { min-height: 2.55rem; border-radius: .9rem; padding: .62rem .9rem; font-weight: 780; }
    .btn-primary { border: 0; color: var(--primary-foreground); background: var(--primary); }
    .btn-primary:disabled { opacity: .6; }
    .btn-secondary { border: 1px solid var(--border); color: var(--secondary-foreground); background: rgba(255,255,255,.68); }
    .error { color: var(--destructive); background: rgba(210,70,61,.1); border: 1px solid rgba(210,70,61,.18); border-radius: 1rem; padding: .85rem 1rem; }
    .table-card { overflow: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: .85rem 1rem; background: rgba(238,243,248,.72); color: var(--muted-foreground); font-size: .72rem; text-transform: uppercase; }
    td { padding: .85rem 1rem; border-top: 1px solid var(--border); color: var(--foreground); }
    .badge { display: inline-flex; border-radius: 999px; padding: .22rem .6rem; font-size: .75rem; font-weight: 800; }
    .badge[data-role="ADMIN"] { background: rgba(210,70,61,.12); color: var(--destructive); }
    .badge[data-role="DOCTOR"] { background: rgba(40,169,122,.14); color: var(--success); }
    .badge[data-role="PATIENT"] { background: rgba(52,118,212,.12); color: var(--primary); }
    @media (max-width: 760px) { .header { align-items: stretch; flex-direction: column; } .form-grid { grid-template-columns: 1fr; } }
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
