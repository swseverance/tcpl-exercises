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
  loadExercise,
  loadExerciseFailure,
  loadExercises,
  loadExercisesFailed,
  pendingChangesSaved,
  savePendingChangesFailure,
  selectExercise,
  submitExercise,
  submitExerciseFailed
} from './exercise.actions';
import { DEFAULT_EXERCISE, exerciseEntityAdapter, initialExerciseState } from './exercise.state';

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

  on(selectExercise, (state, { id }) => ({ ...state, id })),

  on(loadExercise, (state, { id }) => {
    const existing = state.entities[id];

    return exerciseEntityAdapter.upsertOne(
      existing
        ? { ...existing, loading: true }
        : { ...DEFAULT_EXERCISE, id, pendingChanges: '', loading: true, submitting: false },
      state
    );
  }),

  on(exerciseLoaded, exerciseTransferred, (state, { exercise }) => {
    const existing = state.entities[exercise.id];

    return exerciseEntityAdapter.upsertOne(
      existing
        ? {
            ...exercise,
            code: existing.pendingChanges || exercise.code,
            pendingChanges: existing.pendingChanges,
            submitting: existing.submitting,
            loading: false
          }
        : { ...exercise, pendingChanges: '', submitting: false, loading: false },
      state
    );
  }),

  on(loadExerciseFailure, (state, { id }) =>
    exerciseEntityAdapter.updateOne({ id, changes: { loading: false } }, state)
  ),

  on(codeEdited, (state, { code }) =>
    exerciseEntityAdapter.updateOne({ id: state.id, changes: { pendingChanges: code } }, state)
  ),

  on(pendingChangesSaved, (state, { id, code }) => {
    const entity = state.entities[id];

    if (!entity || entity.pendingChanges !== code) {
      return state;
    }

    return exerciseEntityAdapter.updateOne({ id, changes: { pendingChanges: '' } }, state);
  }),

  on(savePendingChangesFailure, (state, { id, error }) => {
    const entity = state.entities[id];

    if (!entity || !(error instanceof HttpErrorResponse) || error.status !== 400) {
      return state;
    }

    return exerciseEntityAdapter.updateOne({ id, changes: { pendingChanges: '' } }, state);
  }),

  on(submitExercise, (state) => ({
    ...exerciseEntityAdapter.updateOne({ id: state.id, changes: { submitting: true } }, state),
    chapters: updateExerciseStatus(state.chapters, state.id, 'pending')
  })),

  on(exerciseSubmitted, (state, { exercise }) => {
    const entity = state.entities[exercise.id];
    const chapters = updateExerciseStatus(state.chapters, exercise.id, exercise.status);

    if (!entity) {
      return { ...state, chapters };
    }

    const { code: _submittedCode, ...rest } = exercise;

    return exerciseEntityAdapter.updateOne(
      {
        id: exercise.id,
        changes: {
          ...rest,
          pendingChanges: entity.pendingChanges === exercise.code ? '' : entity.pendingChanges,
          submitting: false
        }
      },
      { ...state, chapters }
    );
  }),

  on(submitExerciseFailed, (state, { id }) => ({
    ...exerciseEntityAdapter.updateOne({ id, changes: { submitting: false } }, state),
    chapters: updateExerciseStatus(state.chapters, id, 'indeterminate')
  })),

  on(loadExercises, (state) => ({
    ...state,
    chaptersLoading: true
  })),

  on(exercisesLoaded, (state, { chapters }) => ({
    ...state,
    chapters,
    chaptersLoading: false
  })),

  on(loadExercisesFailed, (state) => ({
    ...state,
    chaptersLoading: false
  })),

  on(chaptersTransferred, (state, { chapters }) => ({
    ...state,
    chapters,
    chaptersLoading: false
  }))
);
