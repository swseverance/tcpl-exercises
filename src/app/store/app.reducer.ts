import { HttpErrorResponse } from '@angular/common/http';
import { createReducer, on } from '@ngrx/store';
import {
  exerciseDraftLoaded,
  exerciseDraftSaved,
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

  on(exerciseDraftLoaded, (state, { draft }) => ({
    ...state,
    draft: { ...state.draft, [draft.exerciseId]: draft }
  })),

  on(updateExerciseDraftCode, (state, { code }) => {
    const id = state.id!;

    return {
      ...state,
      pendingChanges: {
        ...state.pendingChanges,
        [id]: { ...(state.pendingChanges[id] ?? state.draft[id])!, code }
      }
    };
  }),

  on(exerciseDraftSaved, (state, { draft }) => {
    const pendingChanges = { ...state.pendingChanges };

    if (pendingChanges[draft.exerciseId]?.code === draft.code) {
      delete pendingChanges[draft.exerciseId];
    }

    return { ...state, pendingChanges };
  }),

  on(saveExerciseDraftFailure, (state, { id, error }) => {
    if (error instanceof HttpErrorResponse && error.status === 400) {
      const pendingChanges = { ...state.pendingChanges };
      delete pendingChanges[id];

      return { ...state, pendingChanges };
    }

    return state;
  })
);
