import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeName } from '../services/theme';
import { AppState } from './app.state';
import { openSignInModal, signOutWithGoogle } from './auth/auth.actions';
import { selectAuthenticated } from './auth/auth.selectors';
import {
  codeEdited,
  loadExercises,
  selectExercise,
  submitExercise
} from './exercise/exercise.actions';
import {
  selectChapters,
  selectExercise as selectExerciseSelector,
  selectExercisesLoading,
  selectSubmissionPending
} from './exercise/exercise.selectors';
import { setTheme } from './settings/settings.actions';
import { selectTheme } from './settings/settings.selectors';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private readonly store = inject(Store<AppState>);

  readonly authenticated$ = this.store.select(selectAuthenticated);
  readonly theme$ = this.store.select(selectTheme);
  readonly exercise$ = this.store.select(selectExerciseSelector);
  readonly submissionPending$ = this.store.select(selectSubmissionPending);
  readonly chapters$ = this.store.select(selectChapters);
  readonly exercisesLoading$ = this.store.select(selectExercisesLoading);

  openSignInModal(): void {
    this.store.dispatch(openSignInModal());
  }

  signOut(): void {
    this.store.dispatch(signOutWithGoogle());
  }

  setTheme(name: ThemeName): void {
    this.store.dispatch(setTheme({ name }));
  }

  selectExercise(id: string): void {
    this.store.dispatch(selectExercise({ id }));
  }

  codeEdited(code: string): void {
    this.store.dispatch(codeEdited({ code }));
  }

  submitExercise(code: string): void {
    this.store.dispatch(submitExercise({ code }));
  }

  loadExercises(authenticated: boolean): void {
    this.store.dispatch(loadExercises({ authenticated }));
  }
}
