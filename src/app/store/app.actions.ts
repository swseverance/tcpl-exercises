import { createAction, props } from '@ngrx/store';
import { ExerciseFinal } from '../../models/exercise';
import { ExerciseDraft } from '../../models/exercise-draft';
import { ExerciseSubmission } from '../../models/exercise-submission';
import { ExerciseTestResultsResponse } from '../../models/exercise-test-results';
import { ThemeName } from '../services/theme';

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

export const saveExerciseDraft = createAction(
  'Save Exercise Draft',
  props<{ id: string; code: string }>()
);

export const exerciseDraftSaved = createAction(
  'Exercise Draft Saved',
  props<{ draft: ExerciseDraft }>()
);

export const saveExerciseDraftFailure = createAction(
  'Save Exercise Draft Failure',
  props<{ id: string; error: unknown }>()
);

export const submitExercise = createAction('Submit Exercise', props<{ code: string }>());

export const exerciseSubmitted = createAction(
  'Exercise Submitted',
  props<{ submission: ExerciseSubmission }>()
);

export const submitExerciseFailure = createAction(
  'Submit Exercise Failure',
  props<{ id: string; error: unknown }>()
);

export const loadExerciseSubmissions = createAction(
  'Load Exercise Submissions',
  props<{ id: string }>()
);

export const exerciseSubmissionsLoaded = createAction(
  'Exercise Submissions Loaded',
  props<{ id: string; submissions: ExerciseSubmission[] }>()
);

export const loadExerciseSubmissionsFailure = createAction(
  'Load Exercise Submissions Failure',
  props<{ id: string; error: unknown }>()
);

export const loadExerciseTestResults = createAction(
  'Load Exercise Test Results',
  props<{ id: string }>()
);

export const exerciseTestResultsLoaded = createAction(
  'Exercise Test Results Loaded',
  props<{ id: string; response: ExerciseTestResultsResponse }>()
);

export const loadExerciseTestResultsFailure = createAction(
  'Load Exercise Test Results Failure',
  props<{ id: string; error: unknown }>()
);

// FINAL ACTIONS

export const loadExercise = createAction('Load Exercise', props<{ id: string }>());

export const exerciseLoaded = createAction('Exercise Loaded', props<{ exercise: ExerciseFinal }>());

export const loadExerciseFailure = createAction('Load Exercise Failure', props<{ error: any }>());
