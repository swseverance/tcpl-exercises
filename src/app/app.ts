import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User
} from 'firebase/auth';
import { RunCResponse } from '../models/run-c';
import { CodeRunner } from './services/code-runner';
import { ENVIRONMENT } from './tokens/environment';
import { AUTH } from './tokens/firebase';

const DEFAULT_CODE = `#include <stdio.h>

int main(void) {
    printf("Hello, world!\\n");
    return 0;
}
`;

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {
  private readonly auth = inject(AUTH);
  private readonly codeRunner = inject(CodeRunner);

  protected readonly environment = inject(ENVIRONMENT);

  protected readonly user = signal<User | null>(null);
  protected readonly code = signal(DEFAULT_CODE);
  protected readonly running = signal(false);
  protected readonly result = signal<RunCResponse | null>(null);
  protected readonly error = signal<string | null>(null);

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

  protected onCodeInput(event: Event): void {
    this.code.set((event.target as HTMLTextAreaElement).value);
  }

  protected run(): void {
    this.running.set(true);
    this.error.set(null);
    this.result.set(null);

    this.codeRunner.run(this.code()).subscribe({
      next: (result) => {
        this.result.set(result);
        this.running.set(false);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to run program');
        this.running.set(false);
      }
    });
  }
}
