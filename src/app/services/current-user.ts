import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, PLATFORM_ID, Service, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User
} from 'firebase/auth';
import { AUTH } from '../tokens/firebase';

@Service()
export class CurrentUser {
  private readonly auth = inject(AUTH);

  readonly user = signal<User | null>(null);

  constructor() {
    const auth = this.auth;

    if (!isPlatformBrowser(inject(PLATFORM_ID)) || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => this.user.set(user));
    inject(DestroyRef).onDestroy(unsubscribe);
  }

  signInWithGoogle(): Promise<void> {
    if (!this.auth) {
      return Promise.resolve();
    }

    return signInWithRedirect(this.auth, new GoogleAuthProvider());
  }

  signOut(): Promise<void> {
    if (!this.auth) {
      return Promise.resolve();
    }

    return signOut(this.auth);
  }
}
