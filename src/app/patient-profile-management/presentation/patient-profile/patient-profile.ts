import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthStore } from '../../../account-management/application/auth.store';
import { ProfileService } from '../../application/profile.service';
import { UpdateProfileRequest } from '../../infrastructure/profile.response';
import { I18nPipe } from '../../../shared/infrastructure/i18n/i18n.pipe';

@Component({
  selector: 'app-patient-profile',
  imports: [FormsModule, I18nPipe],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile implements OnInit {
  protected readonly profileService = inject(ProfileService);
  private readonly authStore = inject(AuthStore);

  protected readonly editing = signal(false);
  protected readonly firstName = signal('');
  protected readonly lastName = signal('');
  protected readonly phoneNumber = signal('');
  protected readonly dateOfBirth = signal('');
  protected readonly saveMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (this.authStore.token()) {
      this.profileService.loadMyProfile();
    }
  }

  protected startEditing(): void {
    const profile = this.profileService.profile();
    if (!profile) return;

    this.firstName.set(profile.firstName);
    this.lastName.set(profile.lastName);
    this.phoneNumber.set(profile.phoneNumber);
    this.dateOfBirth.set(profile.dateOfBirth);
    this.saveMessage.set(null);
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    this.editing.set(false);
    this.saveMessage.set(null);
  }

  protected saveProfile(): void {
    const request: UpdateProfileRequest = {
      firstName: this.firstName().trim(),
      lastName: this.lastName().trim(),
      phoneNumber: this.phoneNumber().trim(),
      dateOfBirth: this.dateOfBirth(),
    };

    this.profileService.updateMyProfile(request).subscribe({
      next: () => {
        this.editing.set(false);
        this.saveMessage.set('Perfil actualizado correctamente');
        setTimeout(() => this.saveMessage.set(null), 2500);
      },
    });
  }
}
