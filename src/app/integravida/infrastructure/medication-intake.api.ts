import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface MedicationIntakeConfirmation {
  medicationId: string;
  takenAt: string;
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class MedicationIntakeApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.integravidaProviderApiBaseUrl}${environment.integravidaProviderMedicationIntakesEndpointPath}`;

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  confirmDose(token: string, medicationId: string, notes?: string): Observable<unknown> {
    const payload: MedicationIntakeConfirmation = {
      medicationId,
      takenAt: new Date().toISOString(),
      notes: notes ?? '',
    };

    return this.http.post(this.endpoint, payload, {
      headers: this.authHeaders(token),
    });
  }
}
