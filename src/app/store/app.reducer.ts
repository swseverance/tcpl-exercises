import { HttpErrorResponse } from '@angular/common/http';
import { createReducer, on } from '@ngrx/store';
import { EXERCISES_BY_ID } from '../../exercises';
import {
  exerciseDraftLoaded,
  exerciseDraftSaved,
  exerciseSubmissionsLoaded,
  exerciseSubmitted,
  exerciseTestResultsLoaded,
  saveExerciseDraftFailure,
  selectExercise,
  updateExerciseDraftCode
} from './app.actions';
import { initialAppState } from './app.state';

export const appReducer = createReducer(
  initialAppState,

  on(selectExercise, (state, { id }) => ({
    ...state,
    id,
    submissions: [],
    testResults: {}
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
  }),

  on(exerciseSubmissionsLoaded, (state, { id, submissions }) =>
    id === state.id ? { ...state, submissions } : state
  ),

  on(exerciseSubmitted, (state, { submission }) => {
    if (submission.exerciseId !== state.id) {
      return state;
    }

    const tests = EXERCISES_BY_ID[submission.exerciseId]?.tests ?? [];
    const testResults =
      submission.results.length > 0
        ? Object.fromEntries(
            submission.results.map((result) => [
              result.id,
              { passed: result.passed, stdout: result.stdout }
            ])
          )
        : Object.fromEntries(tests.map((test) => [test.id, { passed: false, stdout: null }]));

    return {
      ...state,
      submissions: [submission, ...state.submissions],
      testResults
    };
  }),

  on(exerciseTestResultsLoaded, (state, { id, response }) => {
    if (id !== state.id) {
      return state;
    }

    const testResults = Object.fromEntries(
      response.tests.map((test) => [test.id, { passed: test.passed, stdout: test.stdout }])
    );

    return { ...state, testResults };
  })
);
