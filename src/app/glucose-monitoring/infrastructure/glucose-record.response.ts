export interface GlucoseRecordResponse {
  id: string | number;
  patientId?: string | number | null;
  patientID?: string | number | null;
  patient_id?: string | number | null;
  glucoseValue?: number | null;
  glucoseLevel?: number | null;
  valueMgdl?: number | null;
  value?: number | null;
  measuredAt?: string | null;
  recordedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  measurementDate?: string | null;
  timestamp?: string | null;
  notes?: string | null;
  [key: string]: unknown;
}
