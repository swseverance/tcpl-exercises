import { createAction, props } from '@ngrx/store';
import { ExerciseFinal } from '../../../models/exercise';

export const selectExercise = createAction('Select Exercise', props<{ id: string }>());

export const loadExercise = createAction(
  'Load Exercise',
  props<{ id: string; authenticated: boolean }>()
);

export const exerciseLoaded = createAction('Exercise Loaded', props<{ exercise: ExerciseFinal }>());

export const loadExerciseFailure = createAction(
  'Load Exercise Failure',
  props<{ error: unknown }>()
);

export const codeEdited = createAction('Code Edited', props<{ code: string }>());

export const savePendingChanges = createAction(
  'Save Pending Changes',
  props<{ id: string; code: string }>()
);

export const pendingChangesSaved = createAction(
  'Pending Changes Saved',
  props<{ id: string; code: string }>()
);

export const savePendingChangesFailure = createAction(
  'Save Pending Changes Failure',
  props<{ id: string; error: unknown }>()
);

export const submitExercise = createAction('Submit Exercise', props<{ code: string }>());

export const exerciseSubmitted = createAction(
  'Exercise Submitted',
  props<{ exercise: ExerciseFinal }>()
);

export const submitExerciseFailed = createAction(
  'Submit Exercise Failed',
  props<{ error: unknown }>()
);
