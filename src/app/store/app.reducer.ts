import { createReducer, on } from '@ngrx/store';
import {
  exerciseDraftLoaded,
  exerciseDraftsSaved,
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

  on(exerciseDraftsSaved, (state, { saved, invalid }) => {
    const pendingChanges = { ...state.pendingChanges };

    for (const { exerciseId, code } of saved) {
      if (pendingChanges[exerciseId]?.code === code) {
        delete pendingChanges[exerciseId];
      }
    }

    for (const { id } of invalid) {
      delete pendingChanges[id];
    }

    return { ...state, pendingChanges };
  })
);
