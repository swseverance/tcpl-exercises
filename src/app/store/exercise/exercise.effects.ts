import { inject, Injectable } from '@angular/core';
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
import { ExerciseService } from '../../services/exercise-service';
import { Logger } from '../../services/logger';
import { AppState } from '../app.state';
import { selectAuthenticated } from '../auth/auth.selectors';
import {
  exerciseLoaded,
  exerciseSubmitted,
  loadExercise,
  loadExerciseFailure,
  pendingChangesSaved,
  savePendingChanges,
  savePendingChangesFailure,
  submitExercise,
  submitExerciseFailed
} from './exercise.actions';
import { selectId, selectPendingChanges } from './exercise.selectors';

const SAVE_INTERVAL_MS = 10_000;

@Injectable()
export class ExerciseEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  private exercise = inject(ExerciseService);
  private message = inject(NzMessageService);
  private logger = inject(Logger);

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
}
