import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicationApiService } from '../../../../medical-followup/infrastructure/medication-api.service';
import { Medication } from '../../../../medical-followup/domain/model/medication.model';

@Component({
  selector: 'app-upcoming-doses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget">
      <h3>Dosis del Día</h3>
      <ul>
        <li *ngFor="let m of medications">{{ m.name }} - {{ m.time }}</li>
      </ul>
    </div>
  `,
})
export class UpcomingDosesComponent implements OnInit {
  medications: Medication[] = [];

  constructor(private api: MedicationApiService) {}

  ngOnInit(): void {
    this.api.getMedications('123').subscribe((data) => (this.medications = data));
  }
}
