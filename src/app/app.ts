import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Theme } from './services/theme';
import { AppFacade } from './store/app.facade';
import { USER$ } from './tokens/firebase';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    NzLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzTooltipModule,
    RouterLink,
    RouterOutlet
  ],
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {
  protected readonly theme = inject(Theme);
  protected readonly facade = inject(AppFacade);
  protected readonly user$ = inject(USER$);
}
