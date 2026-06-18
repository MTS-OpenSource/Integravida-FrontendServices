import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; // <-- Asegúrate de importar catchError

import { BaseApi } from '../../shared/infrastructure/base.api';
import { PatientProfileEntity } from '../domain/model/patient-profile.entity';
import { PatientProfileApiEndpoint } from './patient-profile.api.endpoint';
import { PatientProfileAssembler } from './patient-profile.assembler';
import { PatientProfileResponse } from './patient-profile.response';

@Injectable({
  providedIn: 'root',
})
export class PatientProfileApi extends BaseApi<PatientProfileEntity, PatientProfileResponse> {
  constructor(private readonly patientProfileEndpoint: PatientProfileApiEndpoint) {
    super(patientProfileEndpoint, new PatientProfileAssembler());
  }

  getProfile(patientId: number | string): Observable<PatientProfileEntity | null> {
    return this.getOneFrom(this.patientProfileEndpoint.getById(patientId as any)).pipe(
      catchError((error) => {
        console.warn(
          'El backend devolvió un error. Cargando perfil simulado de respaldo...',
          error,
        );

        const numericId = typeof patientId === 'number' ? patientId : parseInt(patientId, 10) || 1;

        const mockProfile = new PatientProfileEntity(
          numericId,
          null,
          'Jean Arias',
          2,
          '+51924242424',
        );

        (mockProfile as any).email = 'paciente@gmail.com';
        (mockProfile as any).bloodType = 'O+';
        (mockProfile as any).hba1c = '6.8%';
        (mockProfile as any).allergies = ['Penicilina', 'Sulfamidas', 'Látex'];
        (mockProfile as any).medications = ['Metformina 850mg', 'Glibenclamida 5mg'];

        return of(mockProfile);
      }),
    );
  }

  updateProfile(profile: PatientProfileEntity): Observable<PatientProfileEntity> {
    const resource = (this.assembler as PatientProfileAssembler).toResourceFrom(profile);

    return this.http
      .put<PatientProfileResponse>(this.patientProfileEndpoint.getById(profile.id), resource)
      .pipe(map((response) => this.assembler.toEntityFrom(response)));
  }
}
