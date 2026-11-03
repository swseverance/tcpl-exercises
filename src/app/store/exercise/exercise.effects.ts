import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, combineLatest, filter, map, of, switchMap, tap } from 'rxjs';
import { ExerciseService } from '../../services/exercise-service';
import { AppState } from '../app.state';
import { selectAuthenticated } from '../auth/auth.selectors';
import { exerciseLoaded, loadExercise, loadExerciseFailure } from './exercise.actions';
import { selectId } from './exercise.selectors';

@Injectable()
export class ExerciseEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  private exercise = inject(ExerciseService);
  private message = inject(NzMessageService);

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
          if (error instanceof HttpErrorResponse) {
            console.error(`[exercise] load failed (${error.status}):`, error.message);
          } else {
            console.error('[exercise] load failed:', error);
          }

          this.message.error('Failed to Load Exercise');
        })
      ),
    { dispatch: false }
  );
}
