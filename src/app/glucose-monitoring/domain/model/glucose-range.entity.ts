export class GlucoseRangeEntity {
  constructor(
    public readonly id: string | number,
    public readonly patientId: string | number | null,
    public readonly minimumValue: number | null,
    public readonly maximumValue: number | null,
    public readonly active: boolean,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
    public readonly raw: Record<string, unknown>,
  ) {}

  get min(): number | null {
    return this.minimumValue;
  }

  get max(): number | null {
    return this.maximumValue;
  }
}
