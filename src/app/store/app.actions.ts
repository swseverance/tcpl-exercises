import { createAction, props } from '@ngrx/store';
import { ThemeName } from '../services/theme';

export const openSignInModal = createAction('Open Sign In Modal');

export const closeSignInModal = createAction('Close Sign In Modal');

export const signInWithGoogle = createAction('Sign In With Google');

export const signOutWithGoogle = createAction('Sign Out With Google');

export const signOutSuccess = createAction('Sign Out Success');

export const signOutFailure = createAction('Sign Out Failure', props<{ error: any }>());

export const setTheme = createAction('Set Theme', props<{ name: ThemeName }>());
