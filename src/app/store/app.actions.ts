import { createAction, props } from '@ngrx/store';
import { ExerciseDraft } from '../../models/exercise-draft';
import { ThemeName } from '../services/theme';

export const openSignInModal = createAction('Open Sign In Modal');

export const closeSignInModal = createAction('Close Sign In Modal');

export const signInWithGoogle = createAction('Sign In With Google');

export const signOutWithGoogle = createAction('Sign Out With Google');

export const signOutSuccess = createAction('Sign Out Success');

export const signOutFailure = createAction('Sign Out Failure', props<{ error: any }>());

export const setTheme = createAction('Set Theme', props<{ name: ThemeName }>());

export const selectExercise = createAction('Select Exercise', props<{ id: string }>());

export const loadExerciseDraft = createAction('Load Exercise Draft', props<{ id: string }>());

export const exerciseDraftLoaded = createAction(
  'Exercise Draft Loaded',
  props<{ draft: ExerciseDraft }>()
);

export const loadExerciseDraftFailure = createAction(
  'Load Exercise Draft Failure',
  props<{ id: string; error: any }>()
);

export const updateExerciseDraftCode = createAction(
  'Update Exercise Draft Code',
  props<{ code: string }>()
);

export const saveExerciseDrafts = createAction(
  'Save Exercise Drafts',
  props<{ drafts: ExerciseDraft[] }>()
);

export const exerciseDraftsSaved = createAction(
  'Exercise Drafts Saved',
  props<{
    saved: ExerciseDraft[];
    failed: { id: string; message: string }[];
    invalid: { id: string; message: string }[];
  }>()
);

export const saveExerciseDraftsError = createAction(
  'Save Exercise Drafts Error',
  props<{ error: any }>()
);
