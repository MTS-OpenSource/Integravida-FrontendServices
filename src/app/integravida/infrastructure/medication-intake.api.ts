import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MedicationEntity } from '../domain/model/medication.entity';

export interface MedicationIntakeConfirmation {
  id?: number;
  medication_id: number;
  medicationId: number;
  scheduled_at: string | null;
  scheduledAt: string | null;
  taken_at: string;
  takenAt: string;
  status: 'done';
}

@Injectable({
  providedIn: 'root',
})
export class MedicationIntakeApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.integravidaProviderApiBaseUrl}${environment.integravidaProviderMedicationIntakesEndpointPath}`;

  confirmDose(medication: MedicationEntity): Observable<MedicationIntakeConfirmation> {
    const now = new Date().toISOString();

    const payload: MedicationIntakeConfirmation = {
      medication_id: medication.id,
      medicationId: medication.id,
      scheduled_at: medication.scheduleTime,
      scheduledAt: medication.scheduleTime,
      taken_at: now,
      takenAt: now,
      status: 'done',
    };

    return this.http.post<MedicationIntakeConfirmation>(this.endpoint, payload);
  }
}
