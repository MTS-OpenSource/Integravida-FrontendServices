export interface AlertResponse {
  id: string | number;
  patient_id?: string | number | null;
  patientID?: string | number | null;
  patientId?: string | number | null;
  glucoseRecordId?: string | number | null;
  type?: string | null;
  glucose_value?: number | null;
  glucoseValue?: number | null;
  severity?: string | null;
  priority?: string | null;
  message?: string | null;
  createdAt?: string | null;
  triggered_at?: string | null;
  sentAt?: string | null;
  read?: boolean | null;
  readAt?: string | null;
  [key: string]: unknown;
}
