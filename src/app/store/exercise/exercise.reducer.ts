import { createReducer, on } from '@ngrx/store';
import { exerciseLoaded, loadExerciseFailure, selectExercise } from './exercise.actions';
import { initialAuthState } from './exercise.state';

export const exerciseReducer = createReducer(
  initialAuthState,

  on(selectExercise, (state, { id }) => ({
    ...state,
    id,
    exerciseLoading: true
  })),

  on(exerciseLoaded, (state, { exercise }) => ({
    ...state,
    exercise,
    exerciseLoading: false
  })),

  on(loadExerciseFailure, (state) => ({
    ...state,
    exerciseLoading: false
  }))
);
