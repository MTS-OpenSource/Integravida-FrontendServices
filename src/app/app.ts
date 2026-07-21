import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from './account-management/application/auth.store';
import { I18nService } from './shared/infrastructure/i18n/i18n.service';
import { I18nPipe } from './shared/infrastructure/i18n/i18n.pipe';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, I18nPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Integravida-FrontendServices');
  protected readonly authStore = inject(AuthStore);
  protected readonly i18n = inject(I18nService);
  protected readonly sidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected signOut(): void {
    this.authStore.signOut();
  }
}
