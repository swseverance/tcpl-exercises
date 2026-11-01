import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User
} from 'firebase/auth';
import { ENVIRONMENT } from './tokens/environment';
import { AUTH } from './tokens/firebase';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {
  private readonly auth = inject(AUTH);
  protected readonly environment = inject(ENVIRONMENT);

  protected readonly user = signal<User | null>(null);

  constructor() {
    if (this.auth) {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => this.user.set(user));
      inject(DestroyRef).onDestroy(unsubscribe);
    }
  }

  protected login(): void {
    if (this.auth) {
      signInWithRedirect(this.auth, new GoogleAuthProvider());
    }
  }

  protected logout(): void {
    if (this.auth) {
      signOut(this.auth);
    }
  }
}
