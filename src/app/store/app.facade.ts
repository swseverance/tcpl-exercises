import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeName } from '../services/theme';
import { AppState } from './app.state';
import { openSignInModal, signOutWithProvider } from './auth/auth.actions';
import { selectUser } from './auth/auth.selectors';
import {
  attemptToSubmitExercise,
  codeEdited,
  loadExercises,
  selectExercise
} from './exercise/exercise.actions';
import {
  selectChapters,
  selectChaptersLoading,
  selectExerciseLoading,
  selectExercise as selectExerciseSelector,
  selectSubmissionPending
} from './exercise/exercise.selectors';
import { setTheme } from './settings/settings.actions';
import { selectTheme } from './settings/settings.selectors';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private readonly store = inject(Store<AppState>);

  readonly user$ = this.store.select(selectUser);
  readonly theme$ = this.store.select(selectTheme);
  readonly exercise$ = this.store.select(selectExerciseSelector);
  readonly exerciseLoading$ = this.store.select(selectExerciseLoading);
  readonly submissionPending$ = this.store.select(selectSubmissionPending);
  readonly chapters$ = this.store.select(selectChapters);
  readonly chaptersLoading$ = this.store.select(selectChaptersLoading);

  openSignInModal(): void {
    this.store.dispatch(openSignInModal());
  }

  signOut(): void {
    this.store.dispatch(signOutWithProvider());
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
    this.store.dispatch(attemptToSubmitExercise({ code }));
  }

  loadExercises(authenticated: boolean): void {
    this.store.dispatch(loadExercises({ authenticated }));
  }
}
