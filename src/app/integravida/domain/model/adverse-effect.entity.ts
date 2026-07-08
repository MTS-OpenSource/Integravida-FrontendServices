export class AdverseEffectEntity {
  constructor(
    public readonly id: string,
    public readonly medicationId: string,
    public readonly patientId: string,
    public readonly takenAt: string,
    public readonly notes: string | null,
    public readonly createdAt: string,
  ) {}
}
