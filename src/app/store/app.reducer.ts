import { createReducer, on } from '@ngrx/store';
import {
  exerciseDraftLoaded,
  exerciseDraftSaved,
  loadExerciseDraft,
  loadExerciseDraftFailure,
  saveExerciseDraft,
  saveExerciseDraftFailure,
  selectExercise,
  setTheme,
  updateExerciseDraftCode
} from './app.actions';
import { initialAppState } from './app.state';

export const appReducer = createReducer(
  initialAppState,

  on(setTheme, (state, { name: theme }) => ({
    ...state,
    theme
  })),

  on(selectExercise, (state, { id }) => ({
    ...state,
    id
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
  })),

  on(updateExerciseDraftCode, (state, { code }) => ({
    ...state,
    draft: { ...state.draft, code, status: 'dirty' as const }
  })),

  on(saveExerciseDraft, (state) => ({
    ...state,
    draft: { ...state.draft, status: 'saving' as const, error: null }
  })),

  on(exerciseDraftSaved, (state) => ({
    ...state,
    draft: { ...state.draft, status: 'saved' as const, error: null }
  })),

  on(saveExerciseDraftFailure, (state, { error }) => ({
    ...state,
    draft: {
      ...state.draft,
      status: 'error' as const,
      error: error instanceof Error ? error.message : String(error)
    }
  }))
);
