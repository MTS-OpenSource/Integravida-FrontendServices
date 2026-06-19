export class GlucoseRecordEntity {
  constructor(
    public readonly id: string | number,
    public readonly patientId: string | number | null,
    public readonly glucoseValue: number | null,
    public readonly measuredAt: string | null,
    public readonly raw: Record<string, unknown>,
    public readonly notes: string | null = null,
  ) {}

  get glucoseLevel(): number | null {
    return this.glucoseValue;
  }

  get recordedAt(): string | null {
    return this.measuredAt;
  }
}
