import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, ReplaySubject } from 'rxjs';

export type SupportedLang = 'en' | 'es';

const STORAGE_KEY = 'iv_lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly http = inject(HttpClient);
  private readonly lang$ = new ReplaySubject<SupportedLang>(1);

  readonly currentLang = signal<SupportedLang>(
    (localStorage.getItem(STORAGE_KEY) as SupportedLang) || 'es'
  );

  readonly translations = toSignal(
    this.lang$.pipe(
      switchMap(lang => this.http.get<Record<string, string>>(`assets/i18n/${lang}.json`))
    ),
    { initialValue: {} as Record<string, string> }
  );

  constructor() {
    this.lang$.next(this.currentLang());
  }

  translate(key: string): string {
    return this.translations()[key] ?? key;
  }

  setLang(lang: SupportedLang): void {
    localStorage.setItem(STORAGE_KEY, lang);
    this.currentLang.set(lang);
    this.lang$.next(lang);
  }

  toggleLang(): void {
    this.setLang(this.currentLang() === 'es' ? 'en' : 'es');
  }
}
