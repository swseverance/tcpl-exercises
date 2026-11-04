import { HttpErrorResponse } from '@angular/common/http';
import { createReducer, on } from '@ngrx/store';
import { Chapter, ExerciseStatus } from '../../../shared/models';
import {
  chaptersTransferred,
  codeEdited,
  exerciseLoaded,
  exercisesLoaded,
  exerciseSubmitted,
  exerciseTransferred,
  loadExerciseFailure,
  loadExercises,
  loadExercisesFailed,
  pendingChangesSaved,
  savePendingChanges,
  savePendingChangesFailure,
  selectExercise,
  submitExercise,
  submitExerciseFailed
} from './exercise.actions';
import { initialExerciseState } from './exercise.state';

function updateExerciseStatus(
  chapters: Chapter[],
  exerciseId: string,
  status: ExerciseStatus
): Chapter[] {
  return chapters.map((chapter) => {
    const index = chapter.exercises.findIndex((exercise) => exercise.id === exerciseId);

    if (index === -1) {
      return chapter;
    }

    const exercises = [...chapter.exercises];
    exercises[index] = { ...exercises[index], status };

    return { ...chapter, exercises };
  });
}

export const exerciseReducer = createReducer(
  initialExerciseState,

  on(selectExercise, (state, { id }) => ({
    ...state,
    id,
    exerciseLoading: true
  })),

  on(exerciseLoaded, exerciseTransferred, (state, { exercise }) => {
    const pending = state.pendingChanges[exercise.id];

    return {
      ...state,
      exercise: pending ? { ...exercise, code: pending.code } : exercise,
      exerciseLoading: false
    };
  }),

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
  }),

  on(submitExercise, (state) => ({
    ...state,
    submissionPending: true,
    chapters: updateExerciseStatus(state.chapters, state.id, 'pending')
  })),

  on(exerciseSubmitted, (state, { exercise }) => {
    const code = state.exercise.code;
    const pending = state.pendingChanges[exercise.id];
    const chapters = updateExerciseStatus(state.chapters, exercise.id, exercise.status);

    if (pending && pending.code === exercise.code) {
      const { [exercise.id]: _removed, ...pendingChanges } = state.pendingChanges;

      return {
        ...state,
        exercise: { ...exercise, code },
        pendingChanges,
        chapters,
        submissionPending: false
      };
    }

    return {
      ...state,
      exercise: { ...exercise, code },
      chapters,
      submissionPending: false
    };
  }),

  on(submitExerciseFailed, (state) => {
    return {
      ...state,
      submissionPending: false,
      chapters: updateExerciseStatus(state.chapters, state.id, 'indeterminate')
    };
  }),

  on(loadExercises, (state) => ({
    ...state,
    exercisesLoading: true
  })),

  on(exercisesLoaded, (state, { chapters }) => ({
    ...state,
    chapters,
    exercisesLoading: false
  })),

  on(loadExercisesFailed, (state) => ({
    ...state,
    exercisesLoading: false
  })),

  on(chaptersTransferred, (state, { chapters }) => ({
    ...state,
    chapters,
    exercisesLoading: false
  }))
);
