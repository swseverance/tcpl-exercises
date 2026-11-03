import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExerciseState } from './exercise.state';

export const selectExerciseState = createFeatureSelector<ExerciseState>('exercise');

export const selectId = createSelector(selectExerciseState, (state) => state.id);
