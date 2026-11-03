import { createReducer, on } from '@ngrx/store';
import { authStateChange } from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  on(authStateChange, (state, { authenticated }) => ({
    ...state,
    authenticated
  }))
);
