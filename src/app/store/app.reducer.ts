import { createReducer, on } from '@ngrx/store';
import {
  exerciseDraftLoaded,
  loadExerciseDraft,
  loadExerciseDraftFailure,
  setTheme
} from './app.actions';
import { initialAppState } from './app.state';

export const appReducer = createReducer(
  initialAppState,

  on(setTheme, (state, { name: theme }) => ({
    ...state,
    theme
  })),

  on(loadExerciseDraft, (state, { id }) => ({
    ...state,
    draft: { exerciseId: id, code: '', status: 'loading' as const, error: null }
  })),

  on(exerciseDraftLoaded, (state, { draft: { exerciseId, code } }) => ({
    ...state,
    draft: { exerciseId, code, status: 'saved' as const, error: null }
  })),

  on(loadExerciseDraftFailure, (state, { error }) => ({
    ...state,
    draft: {
      ...state.draft,
      status: 'error' as const,
      error: error instanceof Error ? error.message : String(error)
    }
  }))
);
