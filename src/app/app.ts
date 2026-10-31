import { Component, inject } from '@angular/core';
import { ENVIRONMENT } from './tokens/environment';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {
  environment = inject(ENVIRONMENT);
}
