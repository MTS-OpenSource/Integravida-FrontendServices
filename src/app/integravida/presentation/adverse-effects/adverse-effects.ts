import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdverseEffectService } from '../../application/adverse-effect.service';
import { CreateAdverseEffectPayload } from '../../infrastructure/adverse-effect.api';

@Component({
  selector: 'app-adverse-effects',
  imports: [FormsModule],
  templateUrl: './adverse-effects.html',
  styleUrl: './adverse-effects.css',
})
export class AdverseEffects implements OnInit {
  protected readonly adverseEffectService = inject(AdverseEffectService);

  protected readonly patientId = signal(1);
  protected readonly medicationId = signal<number | null>(null);
  protected readonly description = signal('');
  protected readonly severity = signal('mild');
  protected readonly occurredAt = signal(new Date().toISOString().slice(0, 16));
  protected readonly formError = signal<string | null>(null);

  protected readonly severityOptions = [
    { value: 'mild', label: 'Leve' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'severe', label: 'Severo' },
  ];

  ngOnInit(): void {
    this.loadHistory();
  }

  protected loadHistory(): void {
    const patientId = Number(this.patientId());

    if (!Number.isFinite(patientId) || patientId <= 0) {
      this.formError.set('Ingresa un Patient ID válido.');
      return;
    }

    this.formError.set(null);
    this.adverseEffectService.getByPatientId(patientId);
  }

  protected registerAdverseEffect(): void {
    const patientId = Number(this.patientId());
    const medicationId = Number(this.medicationId());
    const description = this.description().trim();
    const occurredAt = this.occurredAt();

    if (!Number.isFinite(patientId) || patientId <= 0) {
      this.formError.set('Ingresa un Patient ID válido.');
      return;
    }

    if (!Number.isFinite(medicationId) || medicationId <= 0) {
      this.formError.set('Ingresa un Medication ID válido.');
      return;
    }

    if (!description) {
      this.formError.set('Describe el efecto adverso registrado.');
      return;
    }

    if (!occurredAt) {
      this.formError.set('Selecciona la fecha y hora del efecto adverso.');
      return;
    }

    const payload: CreateAdverseEffectPayload = {
      patientId,
      medicationId,
      description,
      severity: this.severity(),
      occurredAt: new Date(occurredAt).toISOString(),
    };

    this.formError.set(null);
    this.adverseEffectService.create(payload);

    this.description.set('');
    this.severity.set('mild');
    this.occurredAt.set(new Date().toISOString().slice(0, 16));
  }
}
