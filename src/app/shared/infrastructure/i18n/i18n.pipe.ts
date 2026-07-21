import { Pipe, PipeTransform, inject, ChangeDetectorRef, effect } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({ name: 'i18n', standalone: true, pure: false })
export class I18nPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.i18n.currentLang();
      this.cdr.markForCheck();
    });
  }

  transform(key: string): string {
    return this.i18n.translate(key);
  }
}
