export abstract class BaseApiEndpoint {
  protected constructor(
    private readonly apiBaseUrl: string,
    private readonly resourcePath: string
  ) {}

  protected collectionUrl(): string {
    return `${this.apiBaseUrl}${this.resourcePath}`;
  }

  protected resourceUrl(id: number | string): string {
    return `${this.collectionUrl()}/${id}`;
  }
}
