export class AlertEntity {
  constructor(
    public readonly id: string,
    public readonly patientId: string | number | null,
    public readonly type: string | null,
    public readonly title: string | null,
    public readonly desc: string | null,
    public readonly time: string | null,
    public readonly glucoseValue: number | null,
    public readonly severity: string | null,
    public readonly createdAt: string | null,
    public readonly read: boolean | null,
    public readonly raw: Record<string, unknown>,
  ) {}
}
