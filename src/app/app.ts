import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { Theme } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [NzLayoutModule, NzButtonModule, NzIconModule, RouterLink, RouterOutlet],
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {
  protected readonly theme = inject(Theme);
}
