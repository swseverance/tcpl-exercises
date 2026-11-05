import { HttpClient } from '@angular/common/http';
import { inject, Injectable, makeStateKey, REQUEST_CONTEXT, TransferState } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from 'firebase/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  CreateSessionRequestBody,
  CreateSessionResponseBody,
  SessionUser,
  SsrContext
} from '../../../shared/models';
import { Logger } from '../../services/logger';
import { AUTH } from '../../tokens/firebase';
import {
  authStateChange,
  clearCookie,
  clearCookieFailed,
  closeSignInModal,
  cookieCleared,
  cookieSaved,
  loadTokenFailed,
  openSignInModal,
  saveCookie,
  saveCookieFailed,
  signInWithProvider,
  signInWithProviderFailure,
  signInWithProviderSuccess,
  signOutFailure,
  signOutSuccess,
  signOutWithProvider,
  tokenLoaded
} from './auth.actions';

const SESSION_USER_KEY = makeStateKey<SessionUser | null>('sessionUser');

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(AUTH);
  private readonly logger = inject(Logger);
  private readonly ssrContext = inject<SsrContext>(REQUEST_CONTEXT, { optional: true });
  private readonly transferState = inject(TransferState);
  private readonly http = inject(HttpClient);

  authStateChange$ = createEffect(() =>
    new Observable<SessionUser | null>((observer) => {
      if (this.ssrContext) {
        this.transferState.set(SESSION_USER_KEY, this.ssrContext.user);

        observer.next(this.ssrContext.user);

        return () => {};
      } else if (this.auth) {
        observer.next(this.transferState.get(SESSION_USER_KEY, null));

        return onAuthStateChanged(this.auth, (user) => {
          observer.next(user ? { uid: user.uid } : null);
        });
      } else {
        // Neither present: ng build's internal route-discovery pass, which
        // renders once at build time with no real request and no browser
        // platform. Nothing meaningful to report.
        observer.next(null);

        return () => {};
      }
    }).pipe(map((user) => authStateChange({ user })))
  );

  syncCookie$ = createEffect(() => {
    if (!this.auth) {
      return of();
    }

    return new Observable<SessionUser | null>((observer) =>
      onAuthStateChanged(this.auth!, (user) => observer.next(user ? { uid: user.uid } : null))
    ).pipe(map((user) => (user ? saveCookie() : clearCookie())));
  });

  loadToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveCookie),
      switchMap(() =>
        this.auth!.currentUser!.getIdToken()
          .then((token) => tokenLoaded({ token }))
          .catch((error) => loadTokenFailed({ error }))
      )
    )
  );

  loadTokenFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadTokenFailed),
        tap(({ error }) => {
          this.logger.error('Load Token Failed', error);
          this.message.error('Load Token Failed');
        })
      ),
    {
      dispatch: false
    }
  );

  // TODO: is this required? filter((response) => response.status === 'created'),
  saveCookie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tokenLoaded),
      switchMap(({ token }) =>
        this.http
          .post<CreateSessionResponseBody>('/api/session', {
            idToken: token
          } satisfies CreateSessionRequestBody)
          .pipe(
            map(() => cookieSaved()),
            catchError((error) => of(saveCookieFailed({ error })))
          )
      )
    )
  );

  clearCookie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clearCookie),
      switchMap(() =>
        this.http.delete('/api/session').pipe(
          map(() => cookieCleared()),
          catchError((error) => of(clearCookieFailed({ error })))
        )
      )
    )
  );

  clearCookieFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(clearCookieFailed),
        tap(({ error }) => {
          this.logger.error('Clear Cookie Failed', error);
          this.message.error('Clear Cookie Failed');
        })
      ),
    {
      dispatch: false
    }
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
              nzOnOk: () => subscriber.next(signInWithProvider({ provider: 'google' })),
              nzOnCancel: () => subscriber.next(closeSignInModal()),
              nzCancelText: 'Cancel'
            });
          })
      )
    )
  );

  signInWithProvider$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInWithProvider),
        switchMap(() =>
          signInWithRedirect(this.auth!, new GoogleAuthProvider())
            .then(() => signInWithProviderSuccess())
            .catch((error) => signInWithProviderFailure({ error }))
        )
      ),
    { dispatch: false }
  );

  signInWithProviderError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInWithProviderFailure),
        tap(({ error }) => {
          this.logger.error('sign in with provider failed', error);
          this.message.error('Failed to Sign In');
        })
      ),
    { dispatch: false }
  );

  signOutWithProvider$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signOutWithProvider),
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
