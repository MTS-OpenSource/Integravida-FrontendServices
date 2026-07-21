import { Component } from '@angular/core';
import { I18nPipe } from '../../../shared/infrastructure/i18n/i18n.pipe';

@Component({
  selector: 'app-forget-password',
  imports: [I18nPipe],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {}
