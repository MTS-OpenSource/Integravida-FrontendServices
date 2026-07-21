export interface PatientAssignment {
  id: string;
  patientId: string;
  doctorId: string;
  assignedAt: string;
}

export interface PatientSummary {
  patientId: string;
  activeTreatments: number;
  totalTreatments: number;
  activeMedications: number;
  totalMedications: number;
  totalGlucoseRecords: number;
}

export interface GlucoseRecord {
  id: string;
  patientId: string;
  glucoseValue: number;
  minimumRange: number;
  maximumRange: number;
  triggeredSeverity: string | null;
  measuredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  patientId: string;
  treatmentId: string;
  name: string;
  dosage: string;
  daysOfWeek: string[];
  doseTimes: string[];
  instructions: string;
  active: boolean;
  discontinuedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentRequest {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export interface CreateMedicationRequest {
  treatmentId: string;
  name: string;
  dosage: string;
  daysOfWeek: string[];
  doseTimes: string[];
  instructions: string;
}
