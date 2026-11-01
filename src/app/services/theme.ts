import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { THEME, ThemeName } from '../tokens/theme';
import { WINDOW } from '../tokens/window';

@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly themeService = inject(THEME);

  readonly theme = signal<ThemeName>(this.themeService?.theme ?? 'light');

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }

    const window = inject(WINDOW);
    const onThemeChange = (event: Event) => {
      this.theme.set((event as CustomEvent<ThemeName>).detail);
    };

    window.addEventListener('themechange', onThemeChange);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('themechange', onThemeChange));
  }

  toggle(): void {
    this.themeService?.toggle();
  }
}
