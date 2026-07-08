export class TreatmentEntity {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly startDate: string,
    public readonly endDate: string | null,
    public readonly status: string,
  ) {}
}
