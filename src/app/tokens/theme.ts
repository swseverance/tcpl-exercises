import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { WINDOW } from './window';

type ThemeService = {
  theme: 'tcpl-exercises-light-theme' | 'tcpl-exercises-dark-theme';
  toggle(): void;
};

declare global {
  interface Window {
    themeService: ThemeService;
  }
}

export const THEME = new InjectionToken<ThemeService | null>('THEME', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? inject(WINDOW).themeService : null)
});
