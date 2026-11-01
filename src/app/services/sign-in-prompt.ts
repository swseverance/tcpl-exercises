import { inject, Service } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CurrentUser } from './current-user';

@Service()
export class SignInPrompt {
  private readonly modal = inject(NzModalService);
  private readonly currentUser = inject(CurrentUser);

  open(): void {
    this.modal.confirm({
      nzTitle: 'Sign in required',
      nzContent: 'Sign in with your Google account to continue.',
      nzOkText: 'Sign in with Google',
      nzOnOk: () => this.currentUser.signInWithGoogle(),
      nzCancelText: 'Cancel'
    });
  }
}
