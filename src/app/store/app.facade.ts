import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeName } from '../services/theme';
import { submitExercise } from './app.actions';
import { selectDraft, selectSubmissions, selectTestResults } from './app.selectors';
import { AppState } from './app.state';
import { openSignInModal, signOutWithGoogle } from './auth/auth.actions';
import { selectAuthenticated } from './auth/auth.selectors';
import { codeEdited, selectExercise } from './exercise/exercise.actions';
import { selectExercise as selectExerciseSelector } from './exercise/exercise.selectors';
import { setTheme } from './settings/settings.actions';
import { selectTheme } from './settings/settings.selectors';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private readonly store = inject(Store<AppState>);

  readonly authenticated$ = this.store.select(selectAuthenticated);
  readonly theme$ = this.store.select(selectTheme);
  readonly exercise$ = this.store.select(selectExerciseSelector);

  readonly draft$ = this.store.select(selectDraft);
  readonly submissions$ = this.store.select(selectSubmissions);
  readonly testResults$ = this.store.select(selectTestResults);

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
