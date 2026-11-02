import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { GoogleAuthProvider, signInWithRedirect, signOut, User } from 'firebase/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  catchError,
  combineLatest,
  filter,
  interval,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { ExerciseService } from '../services/exercise-service';
import { Theme } from '../services/theme';
import { AUTH, USER$ } from '../tokens/firebase';
import {
  closeSignInModal,
  exerciseDraftLoaded,
  exerciseDraftsSaved,
  loadExerciseDraft,
  loadExerciseDraftFailure,
  openSignInModal,
  saveExerciseDrafts,
  saveExerciseDraftsError,
  setTheme,
  signInWithGoogle,
  signOutFailure,
  signOutSuccess,
  signOutWithGoogle
} from './app.actions';
import { selectId, selectPendingChanges } from './app.selectors';
import { AppState } from './app.state';

const SAVE_INTERVAL_MS = 5_000;

@Injectable()
export class AppEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<AppState>);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(AUTH);
  private readonly theme = inject(Theme);
  private readonly exerciseService = inject(ExerciseService);
  private readonly user$ = inject(USER$);

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

  selectExercise$ = createEffect(() =>
    combineLatest([this.store.select(selectId), this.user$]).pipe(
      filter((value): value is [string, User | null] => !!value[0] && !!value[1]),
      map(([id]) => loadExerciseDraft({ id }))
    )
  );

  loadExerciseDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExerciseDraft),
      withLatestFrom(this.store.select(selectPendingChanges)),
      switchMap(([{ id }, pendingChanges]) => {
        const pending = pendingChanges[id];

        if (pending) {
          return of(exerciseDraftLoaded({ draft: pending }));
        }

        return this.exerciseService.getDraft(id).pipe(
          map((draft) => exerciseDraftLoaded({ draft })),
          catchError((error) => of(loadExerciseDraftFailure({ id, error })))
        );
      })
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

  savePendingChanges$ = createEffect(() =>
    interval(SAVE_INTERVAL_MS).pipe(
      withLatestFrom(this.store.select(selectPendingChanges), this.user$),
      filter(([, , user]) => !!user),
      map(([, pendingChanges]) => Object.values(pendingChanges)),
      filter((drafts) => drafts.length > 0),
      map((drafts) => saveExerciseDrafts({ drafts }))
    )
  );

  saveExerciseDrafts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveExerciseDrafts),
      mergeMap(({ drafts }) =>
        this.exerciseService.saveDrafts(drafts).pipe(
          map(({ saved, failed, invalid }) => exerciseDraftsSaved({ saved, failed, invalid })),
          catchError((error) => of(saveExerciseDraftsError({ error })))
        )
      )
    )
  );

  exerciseDraftsSaveFailures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(exerciseDraftsSaved),
        filter(({ failed, invalid }) => failed.length > 0 || invalid.length > 0),
        tap(({ failed, invalid }) => {
          failed.forEach(({ id, message }) =>
            console.error(`[exercise-draft] save failed for ${id}, will retry:`, message)
          );
          invalid.forEach(({ id, message }) =>
            console.error(`[exercise-draft] draft ${id} invalid, dropped:`, message)
          );

          if (failed.length > 0) {
            this.message.error('Failed to Save Exercise Draft');
          }

          if (invalid.length > 0) {
            this.message.error('Exercise Draft Could Not Be Saved');
          }
        })
      ),
    { dispatch: false }
  );

  saveExerciseDraftsError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveExerciseDraftsError),
        tap(({ error }) => {
          console.error('[exercise-draft] save request failed:', error);
          this.message.error('Failed to Save Exercise Draft');
        })
      ),
    { dispatch: false }
  );
}
