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
