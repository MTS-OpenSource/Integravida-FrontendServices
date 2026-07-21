import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthStore } from '../../../account-management/application/auth.store';
import { TreatmentApi } from '../../infrastructure/treatment.api';
import { MedicationApi } from '../../infrastructure/medication.api';
import { TreatmentEntity } from '../../domain/model/treatment.entity';
import { MedicationEntity } from '../../domain/model/medication.entity';
import { AdverseEffectService } from '../../application/adverse-effect.service';
import { CreateAdverseEffectPayload } from '../../infrastructure/adverse-effect.api';

@Component({
  selector: 'app-adverse-effects',
  imports: [FormsModule, CommonModule],
  templateUrl: './adverse-effects.html',
  styleUrl: './adverse-effects.css',
})
export class AdverseEffects implements OnInit {
  protected readonly adverseEffectService = inject(AdverseEffectService);
  private readonly authStore = inject(AuthStore);
  private readonly treatmentApi = inject(TreatmentApi);
  private readonly medicationApi = inject(MedicationApi);

  protected readonly treatment = signal<TreatmentEntity | null>(null);
  protected readonly medications = signal<MedicationEntity[]>([]);
  protected readonly loadingData = signal(false);

  protected readonly selectedMedicationId = signal('');
  protected readonly notes = signal('');
  protected readonly takenAt = signal(new Date().toISOString().slice(0, 16));
  protected readonly formError = signal<string | null>(null);
  protected readonly showForm = signal(false);

  ngOnInit(): void {
    const token = this.authStore.token();
    if (!token) return;

    this.loadingData.set(true);
    this.treatmentApi.getAll(token).subscribe({
      next: (treatments) => {
        if (treatments.length > 0) {
          const activeTreatment = treatments.find((t) => t.status === 'ACTIVE') ?? treatments[0];
          this.treatment.set(activeTreatment);
          this.loadMedications(activeTreatment.id, token);
        } else {
          this.loadingData.set(false);
        }
      },
      error: () => {
        this.loadingData.set(false);
      },
    });

    this.adverseEffectService.getByPatientId();
  }

  private loadMedications(treatmentId: string, token: string): void {
    this.medicationApi.getByTreatmentId(treatmentId, token).subscribe({
      next: (medications) => {
        this.medications.set(medications);
        this.loadingData.set(false);
      },
      error: () => {
        this.loadingData.set(false);
      },
    });
  }

  protected getMedicationName(medicationId: string): string {
    const med = this.medications().find(m => m.id === medicationId);
    return med ? `${med.name} ${med.dosage}` : medicationId;
  }

  protected registerAdverseEffect(): void {
    const medicationId = this.selectedMedicationId().trim();
    const notes = this.notes().trim();
    const takenAt = this.takenAt();

    if (!medicationId) {
      this.formError.set('Selecciona un medicamento.');
      return;
    }
    if (!takenAt) {
      this.formError.set('Selecciona la fecha y hora de la toma.');
      return;
    }

    const payload: CreateAdverseEffectPayload = {
      medicationId,
      takenAt: new Date(takenAt).toISOString(),
      notes,
    };

    this.formError.set(null);
    this.adverseEffectService.create(payload);
    this.notes.set('');
    this.takenAt.set(new Date().toISOString().slice(0, 16));
    this.selectedMedicationId.set('');
    this.showForm.set(false);
  }
}
