import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { Theme } from '../../services/theme';
import { setTheme } from './settings.actions';

@Injectable()
export class SettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly theme = inject(Theme);

  setInitialTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => setTheme({ name: this.theme.getTheme() }))
    )
  );

  setTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setTheme),
        tap(({ name }) => this.theme.applyTheme(name))
      ),
    { dispatch: false }
  );
}
