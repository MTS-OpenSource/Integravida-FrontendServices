import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApiEndpoint } from './base.api.endpoint';
import { BaseAssembler } from './base.assembler';
import { BaseEntity } from './base.entity';
import { BaseResponse } from './base.response';

export abstract class BaseApi<TEntity extends BaseEntity, TResponse extends BaseResponse> {
  protected readonly http = inject(HttpClient);

  protected constructor(
    protected readonly endpoint: BaseApiEndpoint,
    protected readonly assembler: BaseAssembler<TEntity, TResponse>
  ) {}

  protected getAllFrom(url: string): Observable<TEntity[]> {
    return this.http
      .get<TResponse[]>(url)
      .pipe(map((response) => this.assembler.toEntitiesFrom(response)));
  }

  protected getOneFrom(url: string): Observable<TEntity | null> {
    return this.http
      .get<TResponse | null>(url)
      .pipe(map((response) => (response ? this.assembler.toEntityFrom(response) : null)));
  }
}
