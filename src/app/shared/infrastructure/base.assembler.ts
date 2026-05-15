export abstract class BaseAssembler<TEntity, TResponse> {
  abstract toEntityFrom(response: TResponse): TEntity;

  toEntitiesFrom(response: TResponse[]): TEntity[] {
    return response.map((item) => this.toEntityFrom(item));
  }
}
