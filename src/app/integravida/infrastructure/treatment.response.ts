export interface TreatmentResponse {
  id: string;
  patientId: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
