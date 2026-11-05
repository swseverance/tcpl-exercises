import { createAction, props } from '@ngrx/store';
import { SessionUser } from '../../../shared/models';

export const authStateChange = createAction(
  'Auth State Change',
  props<{ user: SessionUser | null }>()
);

export const openSignInModal = createAction('Open Sign In Modal');

export const closeSignInModal = createAction('Close Sign In Modal');

export const signInWithProvider = createAction(
  'Sign In With Provider',
  props<{ provider: 'google' }>()
);

export const signInWithProviderSuccess = createAction('Sign In With Provider Success');

export const signInWithProviderFailure = createAction(
  'Sign In With Provider Failure',
  props<{ error: unknown }>()
);

export const signOutWithProvider = createAction('Sign Out With Provider');

export const signOutSuccess = createAction('Sign Out Success');

export const signOutFailure = createAction('Sign Out Failure', props<{ error: any }>());

export const saveCookie = createAction('Save Cookie');

export const loadToken = createAction('Load  Token');

export const tokenLoaded = createAction('Token Loaded', props<{ token: string }>());

export const loadTokenFailed = createAction('Load Token Failed', props<{ error: unknown }>());

export const cookieSaved = createAction('Cookie Saved');

export const saveCookieFailed = createAction('Save Cookie Failed', props<{ error: unknown }>());

export const clearCookie = createAction('Clear Cookie');

export const cookieCleared = createAction('Cookie Cleared');

export const clearCookieFailed = createAction('Clear Cookie Failed', props<{ error: unknown }>());
