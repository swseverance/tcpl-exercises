import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Logger } from '../../services/logger';
import { AUTH, USER$ } from '../../tokens/firebase';
import {
  authStateChange,
  closeSignInModal,
  openSignInModal,
  signInWithGoogle,
  signOutFailure,
  signOutSuccess,
  signOutWithGoogle
} from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(AUTH);
  private readonly user$ = inject(USER$);
  private readonly logger = inject(Logger);

  authStateChange$ = createEffect(() =>
    this.user$.pipe(map((user) => authStateChange({ authenticated: Boolean(user) })))
  );

  openSignInModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openSignInModal),
      switchMap(
        () =>
          new Observable<Action>((subscriber) => {
            this.modal.confirm({
              nzTitle: 'Sign in required',
              nzContent: 'Sign in with your Google account to continue.',
              nzOkText: 'Sign in with Google',
              nzOnOk: () => subscriber.next(signInWithGoogle()),
              nzOnCancel: () => subscriber.next(closeSignInModal()),
              nzCancelText: 'Cancel'
            });
          })
      )
    )
  );

  signIn$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInWithGoogle),
        switchMap(() => signInWithRedirect(this.auth!, new GoogleAuthProvider()))
      ),
    { dispatch: false }
  );

  signOutWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signOutWithGoogle),
      switchMap(() =>
        signOut(this.auth!)
          .then(() => signOutSuccess())
          .catch((error) => signOutFailure({ error }))
      )
    )
  );

  signOutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signOutSuccess),
        tap(() => this.message.success('Signed Out'))
      ),
    { dispatch: false }
  );

  signOutFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signOutFailure),
        tap(({ error }) => {
          this.logger.error('[auth] sign out failed:', error);
          this.message.error('Failed to Sign Out');
        })
      ),
    { dispatch: false }
  );
}
