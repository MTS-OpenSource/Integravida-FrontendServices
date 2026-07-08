export interface MedicationResponse {
  id: string;
  patientId: string;
  treatmentId: string;
  name: string;
  dosage: string;
  daysOfWeek: string[];
  doseTimes: string[];
  instructions: string | null;
  active: boolean;
  discontinuedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
