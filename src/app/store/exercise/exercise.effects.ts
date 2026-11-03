import { isPlatformServer } from '@angular/common';
import { inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  catchError,
  combineLatest,
  filter,
  from,
  interval,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { Chapter } from '../../../shared/models';
import { ExerciseService } from '../../services/exercise-service';
import { Logger } from '../../services/logger';
import { AppState } from '../app.state';
import { openSignInModal } from '../auth/auth.actions';
import { selectAuthenticated } from '../auth/auth.selectors';
import {
  attemptToSubmitExercise,
  chaptersTransferred,
  exerciseLoaded,
  exercisesLoaded,
  exerciseSubmitted,
  loadExercise,
  loadExerciseFailure,
  loadExercises,
  loadExercisesFailed,
  pendingChangesSaved,
  savePendingChanges,
  savePendingChangesFailure,
  submitExercise,
  submitExerciseFailed
} from './exercise.actions';
import { selectId, selectPendingChanges } from './exercise.selectors';

const CHAPTERS_TRANSFER_KEY = makeStateKey<Chapter[]>('chapters');

const SAVE_INTERVAL_MS = 10_000;

@Injectable()
export class ExerciseEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  private exercise = inject(ExerciseService);
  private message = inject(NzMessageService);
  private logger = inject(Logger);
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  shouldLoadExercise$ = createEffect(() =>
    combineLatest([
      this.store.select(selectId).pipe(filter(Boolean)),
      this.store
        .select(selectAuthenticated)
        .pipe(filter((authenticated) => authenticated !== undefined))
    ]).pipe(map(([id, authenticated]) => loadExercise({ id, authenticated })))
  );

  loadExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExercise),
      switchMap(({ id, authenticated }) =>
        this.exercise.getExercsise(id, authenticated).pipe(
          map((exercise) => exerciseLoaded({ exercise })),
          catchError((error) => of(loadExerciseFailure({ error })))
        )
      )
    )
  );

  loadExerciseFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadExerciseFailure),
        tap(({ error }) => {
          this.logger.error('[exercise] load failed:', error);
          this.message.error('Failed to Load Exercise');
        })
      ),
    { dispatch: false }
  );

  checkForPendingChanges$ = createEffect(() =>
    interval(SAVE_INTERVAL_MS).pipe(
      withLatestFrom(
        this.store.select(selectPendingChanges),
        this.store.select(selectAuthenticated)
      ),
      filter(
        ([, pendingChanges, authenticated]) =>
          Boolean(authenticated) && Object.keys(pendingChanges).length > 0
      ),
      mergeMap(([, pendingChanges]) =>
        from(
          Object.entries(pendingChanges)
            .filter(([, pending]) => !pending.saving)
            .map(([id, pending]) => savePendingChanges({ id, code: pending.code }))
        )
      )
    )
  );

  savePendingChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(savePendingChanges),
      mergeMap(({ id, code }) =>
        this.exercise.saveCode(id, code).pipe(
          map(() => pendingChangesSaved({ id, code })),
          catchError((error) => of(savePendingChangesFailure({ id, error })))
        )
      )
    )
  );

  savePendingChangesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(savePendingChangesFailure),
        tap(({ error }) => {
          this.logger.error('[exercise] save pending changes failed:', error);
          this.message.error('Failed to Save Changes');
        })
      ),
    { dispatch: false }
  );

  attemptToSubmitExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(attemptToSubmitExercise),
      withLatestFrom(this.store.select(selectAuthenticated)),
      map(([{ code }, authenticated]) =>
        authenticated ? submitExercise({ code }) : openSignInModal()
      )
    )
  );

  submitExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitExercise),
      withLatestFrom(this.store.select(selectId)),
      switchMap(([{ code }, id]) =>
        this.exercise.submitExercise(id, code).pipe(
          map((exercise) => exerciseSubmitted({ exercise })),
          catchError((error) => of(submitExerciseFailed({ error })))
        )
      )
    )
  );

  exerciseSubmitted$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(exerciseSubmitted),
        tap(() => this.message.success('Exercise Submitted'))
      ),
    { dispatch: false }
  );

  submitExerciseFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitExerciseFailed),
        tap(({ error }) => {
          this.logger.error('[exercise] submit failed:', error);
          this.message.error('Failed to Submit Exercise');
        })
      ),
    { dispatch: false }
  );

  loadExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExercises),
      switchMap(({ authenticated }) =>
        this.exercise.getExercises(authenticated).pipe(
          map(({ chapters }) => exercisesLoaded({ chapters })),
          catchError((error) => of(loadExercisesFailed({ error })))
        )
      )
    )
  );

  loadExercisesFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadExercisesFailed),
        tap(({ error }) => {
          this.logger.error('[exercises] load failed:', error);
          this.message.error('Failed to Load Exercises');
        })
      ),
    { dispatch: false }
  );

  transferChaptersToClient$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(exercisesLoaded),
        tap(({ chapters }) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(CHAPTERS_TRANSFER_KEY, chapters);
          }
        })
      ),
    { dispatch: false }
  );

  readTransferredChapters$ = createEffect(() => {
    if (!this.transferState.hasKey(CHAPTERS_TRANSFER_KEY)) {
      return of();
    }

    const chapters = this.transferState.get(CHAPTERS_TRANSFER_KEY, []);
    this.transferState.remove(CHAPTERS_TRANSFER_KEY);

    return of(chaptersTransferred({ chapters }));
  });
}
