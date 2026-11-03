import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeName } from '../services/theme';
import { AppState } from './app.state';
import { openSignInModal, signOutWithGoogle } from './auth/auth.actions';
import { selectAuthenticated } from './auth/auth.selectors';
import { codeEdited, selectExercise, submitExercise } from './exercise/exercise.actions';
import { selectExercise as selectExerciseSelector } from './exercise/exercise.selectors';
import { setTheme } from './settings/settings.actions';
import { selectTheme } from './settings/settings.selectors';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private readonly store = inject(Store<AppState>);

  readonly authenticated$ = this.store.select(selectAuthenticated);
  readonly theme$ = this.store.select(selectTheme);
  readonly exercise$ = this.store.select(selectExerciseSelector);

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
}
