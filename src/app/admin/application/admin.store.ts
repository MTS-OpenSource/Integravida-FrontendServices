import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  AdminApi,
  AdminDashboardStats,
  AdminUserResponse,
  AdminDoctorResponse,
  AdminPatientResponse,
  AdminAssignmentResponse,
  CreateDoctorRequest,
  CreateAdminRequest,
  CreateAssignmentRequest,
} from '../infrastructure/admin.api';

@Injectable({ providedIn: 'root' })
export class AdminStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly adminApi = inject(AdminApi);

  readonly dashboardStats = signal<AdminDashboardStats | null>(null);
  readonly users = signal<AdminUserResponse[]>([]);
  readonly doctors = signal<AdminDoctorResponse[]>([]);
  readonly patients = signal<AdminPatientResponse[]>([]);
  readonly assignments = signal<AdminAssignmentResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  loadDashboard(): void {
    this.loading.set(true);
    this.adminApi
      .getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (stats) => {
          this.dashboardStats.set(stats);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load dashboard');
          this.loading.set(false);
        },
      });
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminApi
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users.set(users);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load users');
          this.loading.set(false);
        },
      });
  }

  loadDoctors(): void {
    this.loading.set(true);
    this.adminApi
      .getDoctors()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (doctors) => {
          this.doctors.set(doctors);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load doctors');
          this.loading.set(false);
        },
      });
  }

  loadPatients(): void {
    this.loading.set(true);
    this.adminApi
      .getPatients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (patients) => {
          this.patients.set(patients);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load patients');
          this.loading.set(false);
        },
      });
  }

  loadAssignments(): void {
    this.loading.set(true);
    this.adminApi
      .getAssignments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (assignments) => {
          this.assignments.set(assignments);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load assignments');
          this.loading.set(false);
        },
      });
  }

  createDoctor(request: CreateDoctorRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.adminApi
      .createDoctor(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadDoctors();
          this.loadUsers();
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error || 'Failed to create doctor');
          this.loading.set(false);
        },
      });
  }

  createAdmin(request: CreateAdminRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.adminApi
      .createAdmin(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadUsers();
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error || 'Failed to create admin');
          this.loading.set(false);
        },
      });
  }

  createAssignment(request: CreateAssignmentRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.adminApi
      .createAssignment(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadAssignments();
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error || 'Failed to create assignment');
          this.loading.set(false);
        },
      });
  }

  deleteAssignment(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.adminApi
      .deleteAssignment(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadAssignments();
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to delete assignment');
          this.loading.set(false);
        },
      });
  }
}
