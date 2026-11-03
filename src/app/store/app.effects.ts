import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  catchError,
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
import { ExerciseService } from '../services/exercise-service';
import { Logger } from '../services/logger';
import { AUTH, USER$ } from '../tokens/firebase';
import {
  exerciseDraftLoaded,
  exerciseDraftSaved,
  exerciseSubmissionsLoaded,
  exerciseSubmitted,
  exerciseTestResultsLoaded,
  loadExerciseDraft,
  loadExerciseDraftFailure,
  loadExerciseSubmissions,
  loadExerciseSubmissionsFailure,
  loadExerciseTestResults,
  loadExerciseTestResultsFailure,
  saveExerciseDraft,
  saveExerciseDraftFailure,
  submitExercise,
  submitExerciseFailure
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
  private readonly exerciseService = inject(ExerciseService);
  private readonly user$ = inject(USER$);
  private readonly logger = inject(Logger);

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
          this.logger.error('[exercise-draft] load failed:', error);
          this.message.error('Failed to Load Exercise Draft');
        })
      ),
    { dispatch: false }
  );

  loadExerciseSubmissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExerciseSubmissions),
      switchMap(({ id }) =>
        this.exerciseService.listSubmissions(id).pipe(
          map((submissions) => exerciseSubmissionsLoaded({ id, submissions })),
          catchError((error) => of(loadExerciseSubmissionsFailure({ id, error })))
        )
      )
    )
  );

  loadExerciseSubmissionsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadExerciseSubmissionsFailure),
        tap(({ error }) => {
          this.logger.error('[exercise-submissions] load failed:', error);
          this.message.error('Failed to Load Exercise Submissions');
        })
      ),
    { dispatch: false }
  );

  loadExerciseTestResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExerciseTestResults),
      switchMap(({ id }) =>
        this.exerciseService.getTestResults(id).pipe(
          map((response) => exerciseTestResultsLoaded({ id, response })),
          catchError((error) => of(loadExerciseTestResultsFailure({ id, error })))
        )
      )
    )
  );

  loadExerciseTestResultsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadExerciseTestResultsFailure),
        tap(({ error }) => {
          this.logger.error('[exercise-test-results] load failed:', error);
          this.message.error('Failed to Load Test Results');
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
      mergeMap((drafts) => from(drafts)),
      map((draft) => saveExerciseDraft({ id: draft.exerciseId, code: draft.code }))
    )
  );

  saveExerciseDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveExerciseDraft),
      mergeMap(({ id, code }) =>
        this.exerciseService.saveDraft(id, code).pipe(
          map((draft) => exerciseDraftSaved({ draft })),
          catchError((error) => of(saveExerciseDraftFailure({ id, error })))
        )
      )
    )
  );

  saveExerciseDraftFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveExerciseDraftFailure),
        tap(({ id, error }) => {
          if (error instanceof HttpErrorResponse && error.status === 400) {
            this.logger.error(`[exercise-draft] save rejected for ${id}, dropped:`, error);
            this.message.error('Exercise Draft Could Not Be Saved');
          } else {
            this.logger.error(`[exercise-draft] save failed for ${id}, will retry:`, error);
            this.message.error('Failed to Save Exercise Draft');
          }
        })
      ),
    { dispatch: false }
  );

  submitExercise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitExercise),
      withLatestFrom(this.store.select(selectId)),
      mergeMap(([{ code }, id]) =>
        this.exerciseService.submit(id!, code).pipe(
          map((submission) => exerciseSubmitted({ submission })),
          catchError((error) => of(submitExerciseFailure({ id: id!, error })))
        )
      )
    )
  );

  submitExerciseFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(submitExerciseFailure),
        tap(({ id, error }) => {
          this.logger.error(`[exercise-submission] submit failed for ${id}:`, error);
          this.message.error('Failed to Submit Exercise');
        })
      ),
    { dispatch: false }
  );
}
