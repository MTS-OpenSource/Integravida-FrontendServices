export class MedicationEntity {
  constructor(
    public readonly id: string,
    public readonly treatmentId: string,
    public readonly name: string,
    public readonly dosage: string,
    public readonly daysOfWeek: string[],
    public readonly doseTimes: string[],
    public readonly instructions: string | null,
    public readonly active: boolean,
  ) {}
}
