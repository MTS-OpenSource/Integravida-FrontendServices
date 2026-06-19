export interface GlucoseRangeResponse {
  id: string | number;
  patientId?: string | number | null;
  minimumValue?: number | null;
  maximumValue?: number | null;
  active?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}
