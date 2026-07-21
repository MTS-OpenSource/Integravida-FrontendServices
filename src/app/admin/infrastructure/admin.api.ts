import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminApiEndpoint } from './admin.api.endpoint';
import { AuthStore } from '../../account-management/application/auth.store';

export interface AdminDashboardStats {
  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;
}

export interface AdminUserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDoctorResponse {
  id: string;
  profileId: string;
  doctorRecordNumber: string;
  notes: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPatientResponse {
  id: string;
  profileId: string;
  medicalRecordNumber: string;
  notes: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAssignmentResponse {
  id: string;
  patientId: string;
  doctorId: string;
  assignedAt: string;
}

export interface CreateDoctorRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  doctorRecordNumber: string;
  doctorNotes: string;
}

export interface CreateAdminRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface CreateAssignmentRequest {
  patientId: string;
  doctorId: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = new AdminApiEndpoint();
  private readonly authStore = inject(AuthStore);

  private authHeaders(): HttpHeaders {
    const token = this.authStore.token();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getDashboard(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(this.endpoint.dashboard(), {
      headers: this.authHeaders(),
    });
  }

  getUsers(): Observable<AdminUserResponse[]> {
    return this.http.get<AdminUserResponse[]>(this.endpoint.users(), {
      headers: this.authHeaders(),
    });
  }

  getDoctors(): Observable<AdminDoctorResponse[]> {
    return this.http.get<AdminDoctorResponse[]>(this.endpoint.doctors(), {
      headers: this.authHeaders(),
    });
  }

  getPatients(): Observable<AdminPatientResponse[]> {
    return this.http.get<AdminPatientResponse[]>(this.endpoint.patients(), {
      headers: this.authHeaders(),
    });
  }

  getAssignments(): Observable<AdminAssignmentResponse[]> {
    return this.http.get<AdminAssignmentResponse[]>(this.endpoint.assignments(), {
      headers: this.authHeaders(),
    });
  }

  createDoctor(request: CreateDoctorRequest): Observable<AdminDoctorResponse> {
    return this.http.post<AdminDoctorResponse>(this.endpoint.doctors(), request, {
      headers: this.authHeaders(),
    });
  }

  createAdmin(request: CreateAdminRequest): Observable<AdminUserResponse> {
    return this.http.post<AdminUserResponse>(this.endpoint.users().replace('/users', '/admins'), request, {
      headers: this.authHeaders(),
    });
  }

  createAssignment(request: CreateAssignmentRequest): Observable<AdminAssignmentResponse> {
    return this.http.post<AdminAssignmentResponse>(this.endpoint.assignments(), request, {
      headers: this.authHeaders(),
    });
  }

  deleteAssignment(id: string): Observable<void> {
    return this.http.delete<void>(this.endpoint.deleteAssignment(id), {
      headers: this.authHeaders(),
    });
  }
}
