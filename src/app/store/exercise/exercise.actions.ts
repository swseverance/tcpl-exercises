import { createAction, props } from '@ngrx/store';
import { Chapter, Exercise } from '../../../shared/models';

export const selectExercise = createAction('Select Exercise', props<{ id: string }>());

export const loadExercise = createAction(
  'Load Exercise',
  props<{ id: string; authenticated: boolean }>()
);

export const exerciseLoaded = createAction('Exercise Loaded', props<{ exercise: Exercise }>());

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

export const attemptToSubmitExercise = createAction(
  'Attempt To Submit Exercise',
  props<{ code: string }>()
);

export const submitExercise = createAction('Submit Exercise', props<{ code: string }>());

export const exerciseSubmitted = createAction(
  'Exercise Submitted',
  props<{ exercise: Exercise }>()
);

export const submitExerciseFailed = createAction(
  'Submit Exercise Failed',
  props<{ error: unknown }>()
);

export const loadExercises = createAction('Load Exercises', props<{ authenticated: boolean }>());

export const exercisesLoaded = createAction('Exercises Loaded', props<{ chapters: Chapter[] }>());

export const loadExercisesFailed = createAction(
  'Load Exercises Failed',
  props<{ error: unknown }>()
);

export const chaptersTransferred = createAction(
  'Chapters Transferred',
  props<{ chapters: Chapter[] }>()
);
