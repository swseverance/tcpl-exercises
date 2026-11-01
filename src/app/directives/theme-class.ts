import { Directive, inject } from '@angular/core';
import { THEME } from '../tokens/theme';

@Directive({
  selector: '[appThemeClass]',
  host: {
    '[class.tcpl-exercises-light-theme]': "themeService?.theme === 'light'",
    '[class.tcpl-exercises-dark-theme]': "themeService?.theme === 'dark'"
  }
})
export class ThemeClass {
  protected readonly themeService = inject(THEME);
}
