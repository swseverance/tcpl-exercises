import { HttpErrorResponse } from '@angular/common/http';
import { createReducer, on } from '@ngrx/store';
import {
  codeEdited,
  exerciseLoaded,
  loadExerciseFailure,
  pendingChangesSaved,
  savePendingChanges,
  savePendingChangesFailure,
  selectExercise
} from './exercise.actions';
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
  })),

  on(codeEdited, (state, { code }) => {
    return {
      ...state,
      pendingChanges: {
        ...state.pendingChanges,
        [state.id]: {
          ...(state.pendingChanges[state.id] ?? { saving: false }),
          code
        }
      }
    };
  }),

  on(savePendingChanges, (state, { id }) => ({
    ...state,
    pendingChanges: {
      ...state.pendingChanges,
      [id]: {
        ...state.pendingChanges[id],
        saving: true
      }
    }
  })),

  on(pendingChangesSaved, (state, { id, code }) => {
    const pending = state.pendingChanges[id];

    if (!pending) {
      return state;
    }

    if (pending.code === code) {
      const { [id]: _removed, ...pendingChanges } = state.pendingChanges;
      return { ...state, pendingChanges };
    }

    return {
      ...state,
      pendingChanges: {
        ...state.pendingChanges,
        [id]: { ...pending, saving: false }
      }
    };
  }),

  on(savePendingChangesFailure, (state, { id, error }) => {
    const pending = state.pendingChanges[id];

    if (!pending) {
      return state;
    }

    if (error instanceof HttpErrorResponse && error.status === 400) {
      const { [id]: _removed, ...pendingChanges } = state.pendingChanges;
      return { ...state, pendingChanges };
    }

    return {
      ...state,
      pendingChanges: {
        ...state.pendingChanges,
        [id]: { ...pending, saving: false }
      }
    };
  })
);
