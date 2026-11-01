import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { WINDOW } from '../tokens/window';

const STORAGE_KEY_PREFIX = 'tcpl-exercises:draft:';

@Service()
export class ExerciseDrafts {
  private readonly window = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(WINDOW) : undefined;

  load(exerciseId: string): string | null {
    return this.window?.localStorage.getItem(STORAGE_KEY_PREFIX + exerciseId) ?? null;
  }

  save(exerciseId: string, code: string): void {
    this.window?.localStorage.setItem(STORAGE_KEY_PREFIX + exerciseId, code);
  }
}
