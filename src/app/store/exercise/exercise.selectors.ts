import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExerciseState } from './exercise.state';

export const selectExerciseState = createFeatureSelector<ExerciseState>('exercise');

export const selectId = createSelector(selectExerciseState, (state) => state.id);

export const selectExerciseLoading = createSelector(
  selectExerciseState,
  (state) => state.exerciseLoading
);

export const selectExercise = createSelector(selectExerciseState, (state) => state.exercise);

export const selectPendingChanges = createSelector(
  selectExerciseState,
  (state) => state.pendingChanges
);
