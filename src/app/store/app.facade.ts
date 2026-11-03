import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeName } from '../services/theme';
import { loadExercise, submitExercise, updateExerciseDraftCode } from './app.actions';
import { selectDraft, selectSubmissions, selectTestResults } from './app.selectors';
import { AppState } from './app.state';
import { openSignInModal, signOutWithGoogle } from './auth/auth.actions';
import { setTheme } from './settings/settings.actions';
import { selectTheme } from './settings/settings.selectors';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private readonly store = inject(Store<AppState>);

  readonly theme$ = this.store.select(selectTheme);
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

  loadExercise(id: string): void {
    this.store.dispatch(loadExercise({ id }));
  }

  updateExerciseDraftCode(code: string): void {
    this.store.dispatch(updateExerciseDraftCode({ code }));
  }

  submitExercise(code: string): void {
    this.store.dispatch(submitExercise({ code }));
  }
}
