import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { ExerciseService } from '../services/exercise-service';
import { Theme } from '../services/theme';
import { AUTH } from '../tokens/firebase';
import {
  closeSignInModal,
  exerciseDraftLoaded,
  loadExerciseDraft,
  loadExerciseDraftFailure,
  openSignInModal,
  setTheme,
  signInWithGoogle,
  signOutFailure,
  signOutSuccess,
  signOutWithGoogle
} from './app.actions';
import { AppState } from './app.state';

@Injectable()
export class AppEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<AppState>);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(AUTH);
  private readonly theme = inject(Theme);
  private readonly exerciseService = inject(ExerciseService);

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
        tap(() => this.message.error('Failed to Sign Out'))
      ),
    { dispatch: false }
  );

  loadExerciseDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExerciseDraft),
      switchMap(({ id }) =>
        this.exerciseService.getDraft(id).pipe(
          map((draft) => exerciseDraftLoaded({ draft })),
          catchError((error) => of(loadExerciseDraftFailure({ error })))
        )
      )
    )
  );

  loadExerciseDraftFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadExerciseDraftFailure),
        tap(({ error }) => {
          console.error('[exercise-draft] load failed:', error);
          this.message.error('Failed to Load Exercise Draft');
        })
      ),
    { dispatch: false }
  );

  setInitialTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => setTheme({ name: this.theme.getTheme() }))
    )
  );

  setTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setTheme),
        tap(({ name }) => this.theme.applyTheme(name))
      ),
    { dispatch: false }
  );
}
