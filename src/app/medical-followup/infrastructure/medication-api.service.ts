import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Medication } from '../domain/model/medication.model';

@Injectable({
  providedIn: 'root',
})
export class MedicationApiService {
  private readonly BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

  constructor(private http: HttpClient) {}

  getMedications(term: string): Observable<Medication[]> {
    return this.http.get<any>(`${this.BASE_URL}/drugs.json?name=${term}`).pipe(
      map((response) => {
        const conceptGroup = response.drugGroup.conceptGroup || [];
        const medications: Medication[] = [];

        conceptGroup.forEach((group: any) => {
          if (group.conceptProperties) {
            group.conceptProperties.forEach((prop: any) => {
              medications.push({
                id: prop.rxcui,
                name: prop.name,
                dosage: prop.synonym || 'N/A',
                time: '08:00 AM',
                status: 'Pendiente',
              });
            });
          }
        });
        return medications.slice(0, 10);
      }),
    );
  }
}
