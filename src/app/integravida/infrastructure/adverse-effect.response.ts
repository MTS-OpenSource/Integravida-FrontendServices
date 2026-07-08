export interface AdverseEffectResponse {
  id: string;
  medicationId: string;
  patientId: string;
  takenAt: string;
  notes: string | null;
  createdAt: string;
}
