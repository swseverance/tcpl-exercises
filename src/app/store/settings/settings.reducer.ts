import { createReducer, on } from '@ngrx/store';
import { setTheme } from './settings.actions';
import { initialSettingsState } from './settings.state';

export const settingsReducer = createReducer(
  initialSettingsState,

  on(setTheme, (state, { name: theme }) => ({
    ...state,
    theme
  }))
);
