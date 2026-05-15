import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PatientProfileService } from '../../application/patient-profile.service';
import { PatientProfileEntity } from '../../domain/model/patient-profile.entity';

@Component({
  selector: 'app-patient-profile',
  imports: [FormsModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile implements OnInit {
  protected readonly patientProfileService = inject(PatientProfileService);
  private readonly route = inject(ActivatedRoute);

  protected readonly editing = signal(false);
  protected readonly fullName = signal('');
  protected readonly phone = signal('');
  protected readonly diabetesType = signal<number | null>(null);
  protected readonly saveMessage = signal<string | null>(null);

  ngOnInit(): void {
    const patientId = Number(this.route.snapshot.paramMap.get('patientId') ?? 1);
    this.patientProfileService.getProfile(patientId);
  }

  protected startEditing(): void {
    const profile = this.patientProfileService.profile();

    if (!profile) {
      return;
    }

    this.fullName.set(profile.fullName);
    this.phone.set(profile.phone);
    this.diabetesType.set(profile.diabetesType);
    this.saveMessage.set(null);
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    this.editing.set(false);
    this.saveMessage.set(null);
  }

  protected saveProfile(): void {
    const profile = this.patientProfileService.profile();

    if (!profile) {
      return;
    }

    const updatedProfile = new PatientProfileEntity(
      profile.id,
      profile.userId,
      this.fullName().trim(),
      this.diabetesType(),
      this.phone().trim(),
    );

    this.patientProfileService.saveProfile(updatedProfile).subscribe({
      next: () => {
        this.editing.set(false);
        this.saveMessage.set('Perfil actualizado correctamente');

        setTimeout(() => {
          this.saveMessage.set(null);
        }, 2500);
      },
    });
  }
}
