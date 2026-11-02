import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { openSignInModal, signOutWithGoogle } from './app.actions';
import { AppState } from './app.state';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private readonly store = inject(Store<AppState>);

  openSignInModal(): void {
    this.store.dispatch(openSignInModal());
  }

  signOut(): void {
    this.store.dispatch(signOutWithGoogle());
  }
}
