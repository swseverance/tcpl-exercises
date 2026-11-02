import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeName } from '../services/theme';
import { loadExerciseDraft, openSignInModal, setTheme, signOutWithGoogle } from './app.actions';
import { selectTheme } from './app.selectors';
import { AppState } from './app.state';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private readonly store = inject(Store<AppState>);

  readonly theme$ = this.store.select(selectTheme);

  openSignInModal(): void {
    this.store.dispatch(openSignInModal());
  }

  signOut(): void {
    this.store.dispatch(signOutWithGoogle());
  }

  setTheme(name: ThemeName): void {
    this.store.dispatch(setTheme({ name }));
  }

  loadExerciseDraft(id: string): void {
    this.store.dispatch(loadExerciseDraft({ id }));
  }
}
