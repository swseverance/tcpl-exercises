import { createReducer, on } from '@ngrx/store';
import { setTheme } from './app.actions';
import { initialAppState } from './app.state';

export const appReducer = createReducer(
  initialAppState,

  on(setTheme, (state, { name: theme }) => ({
    ...state,
    theme
  }))
);
