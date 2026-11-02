import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeName } from '../services/theme';
import {
  openSignInModal,
  selectExercise,
  setTheme,
  signOutWithGoogle,
  submitExercise,
  updateExerciseDraftCode
} from './app.actions';
import { selectDraft, selectSubmissions, selectTheme } from './app.selectors';
import { AppState } from './app.state';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private readonly store = inject(Store<AppState>);

  readonly theme$ = this.store.select(selectTheme);
  readonly draft$ = this.store.select(selectDraft);
  readonly submissions$ = this.store.select(selectSubmissions);

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

  updateExerciseDraftCode(code: string): void {
    this.store.dispatch(updateExerciseDraftCode({ code }));
  }

  submitExercise(code: string): void {
    this.store.dispatch(submitExercise({ code }));
  }
}
