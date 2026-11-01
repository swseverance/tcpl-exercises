import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { WINDOW } from './window';

export type ThemeName = 'light' | 'dark';

declare global {
  interface Window {
    themeService: {
      theme: ThemeName;
      toggle(): void;
    };
  }
}

export const THEME = new InjectionToken<Window['themeService'] | null>('THEME', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? inject(WINDOW).themeService : null)
});
