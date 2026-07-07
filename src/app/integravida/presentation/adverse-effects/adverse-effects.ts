import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdverseEffectService } from '../../application/adverse-effect.service';
import { CreateAdverseEffectPayload } from '../../infrastructure/adverse-effect.api';

interface MedicationItem {
  id: number;
  time: string;
  ampm: string;
  name: string;
  dose: string;
  instruction: string;
  done: boolean;
  isNext: boolean;
}

@Component({
  selector: 'app-adverse-effects',
  imports: [FormsModule, CommonModule],
  templateUrl: './adverse-effects.html',
  styleUrl: './adverse-effects.css',
})
export class AdverseEffects implements OnInit {
  protected readonly adverseEffectService = inject(AdverseEffectService);

  protected readonly patientId = signal('');
  protected readonly medicationId = signal<number | null>(null);
  protected readonly description = signal('');
  protected readonly severity = signal('mild');
  protected readonly occurredAt = signal(new Date().toISOString().slice(0, 16));
  protected readonly formError = signal<string | null>(null);
  protected readonly showForm = signal(false);

  protected readonly severityOptions = [
    { value: 'mild', label: 'Leve' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'severe', label: 'Severo' },
  ];

  protected readonly totalDoses = signal(26);
  protected readonly completedDoses = signal(24);

  protected readonly adherencePercentage = computed(() =>
    this.totalDoses() > 0 ? Math.round((this.completedDoses() / this.totalDoses()) * 100) : 0,
  );

  protected readonly currentDateLabel = computed(() => {
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const now = new Date();
    return `${weekdays[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`;
  });

  protected readonly medications = signal<MedicationItem[]>([
    { id: 1, time: '08:00', ampm: 'AM', name: 'Metformina', dose: '500mg', instruction: 'Con el desayuno', done: true, isNext: false },
    { id: 2, time: '12:00', ampm: 'PM', name: 'Glipizida', dose: '5mg', instruction: '30 min antes de comer', done: true, isNext: false },
    { id: 3, time: '18:00', ampm: 'PM', name: 'Metformina', dose: '500mg', instruction: 'Con la cena', done: false, isNext: true },
    { id: 4, time: '21:00', ampm: 'PM', name: 'Sitagliptina', dose: '100mg', instruction: 'Antes de dormir', done: false, isNext: false },
  ]);

  ngOnInit(): void {
    this.loadData();
  }

  protected loadData(): void {
    const pid = this.patientId().trim();
    if (pid) {
      this.adverseEffectService.getByPatientId(pid);
    }
  }

  protected registerAdverseEffect(): void {
    const patientId = Number(this.patientId());
    const medicationId = Number(this.medicationId());
    const description = this.description().trim();
    const occurredAt = this.occurredAt();

    if (!patientId) {
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
    this.medicationId.set(null);
    this.showForm.set(false);
  }
}
