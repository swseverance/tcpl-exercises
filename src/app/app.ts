import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CurrentUser } from './services/current-user';
import { SignInPrompt } from './services/sign-in-prompt';
import { Theme } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [
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
  protected readonly currentUser = inject(CurrentUser);
  protected readonly signInPrompt = inject(SignInPrompt);
  private readonly message = inject(NzMessageService);

  protected async signOut(): Promise<void> {
    try {
      await this.currentUser.signOut();
      this.message.success('Signed out');
    } catch {
      this.message.error('Failed to sign out');
    }
  }
}
