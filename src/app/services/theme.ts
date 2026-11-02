import { inject, Service } from '@angular/core';
import { WINDOW } from '../tokens/window';

export type ThemeName = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

const THEMES: { name: ThemeName; class: string }[] = [
  { name: 'light', class: 'tcpl-exercises-light-theme' },
  { name: 'dark', class: 'tcpl-exercises-dark-theme' }
];

@Service()
export class Theme {
  private readonly window = inject(WINDOW);

  getTheme(): ThemeName {
    return (this.window.localStorage?.getItem(THEME_STORAGE_KEY) as ThemeName) ?? 'light';
  }

  applyTheme(themeName: ThemeName): void {
    this.window.localStorage?.setItem(THEME_STORAGE_KEY, themeName);

    for (const theme of THEMES) {
      const style = this.window.document?.querySelector<HTMLLinkElement>(
        `link[href^="${theme.name}-theme"]`
      );

      if (style) {
        style.disabled = theme.name !== themeName;
      }

      this.window.document?.body.classList.toggle(theme.class, theme.name === themeName);
    }
  }
}
