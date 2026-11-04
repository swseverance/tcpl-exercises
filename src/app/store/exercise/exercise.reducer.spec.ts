import { HttpErrorResponse } from '@angular/common/http';
import { Chapter, Exercise } from '../../../shared/models';
import {
  codeEdited,
  exerciseLoaded,
  exerciseSubmitted,
  loadExerciseFailure,
  pendingChangesSaved,
  savePendingChanges,
  savePendingChangesFailure,
  selectExercise,
  submitExercise,
  submitExerciseFailed
} from './exercise.actions';
import { exerciseReducer } from './exercise.reducer';
import { initialAuthState } from './exercise.state';

const EXERCISE: Exercise = {
  id: '1-1',
  chapter: 1,
  number: 1,
  description: 'Print "hello, world"',
  code: '#include <stdio.h>\n',
  solution: '#include <stdio.h>\n\nint main() {\n  printf("hello, world\\n");\n}\n',
  tests: [
    {
      id: 'a',
      stdin: '',
      expectedStdout: 'hello, world\n',
      actualStdout: '',
      status: 'indeterminate'
    }
  ],
  status: 'indeterminate',
  compilationError: ''
};

const CHAPTERS: Chapter[] = [
  {
    number: 1,
    exercises: [
      { id: '1-1', chapter: 1, number: 1, status: 'indeterminate' },
      { id: '1-2', chapter: 1, number: 2, status: 'passed' }
    ]
  }
];

describe('exerciseReducer', () => {
  describe('selectExercise', () => {
    it('sets the id and marks the exercise as loading, leaving everything else unchanged', () => {
      const state = exerciseReducer(initialAuthState, selectExercise({ id: '1-1' }));

      expect(state).toEqual({
        ...initialAuthState,
        id: '1-1',
        exerciseLoading: true
      });
    });
  });

  describe('exerciseLoaded', () => {
    it('sets the exercise and clears exerciseLoading, leaving everything else unchanged', () => {
      const previousState = { ...initialAuthState, id: '1-1', exerciseLoading: true };

      const state = exerciseReducer(previousState, exerciseLoaded({ exercise: EXERCISE }));

      expect(state).toEqual({
        ...previousState,
        exercise: EXERCISE,
        exerciseLoading: false
      });
    });

    it('merges in the pending code for that exercise when one exists, so an unsaved edit survives navigating away and back', () => {
      const previousState = {
        ...initialAuthState,
        id: '1-1',
        exerciseLoading: true,
        pendingChanges: {
          '1-1': { code: 'unsaved edit', saving: false }
        }
      };

      const state = exerciseReducer(previousState, exerciseLoaded({ exercise: EXERCISE }));

      expect(state).toEqual({
        ...previousState,
        exercise: { ...EXERCISE, code: 'unsaved edit' },
        exerciseLoading: false
      });
    });

    it('uses the loaded code as-is when there is no pending change for that exercise', () => {
      const previousState = {
        ...initialAuthState,
        id: '1-1',
        exerciseLoading: true,
        pendingChanges: {
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(previousState, exerciseLoaded({ exercise: EXERCISE }));

      expect(state).toEqual({
        ...previousState,
        exercise: EXERCISE,
        exerciseLoading: false
      });
    });
  });

  describe('loadExerciseFailure', () => {
    it('clears exerciseLoading, leaving everything else unchanged', () => {
      const previousState = { ...initialAuthState, id: '1-1', exerciseLoading: true };

      const state = exerciseReducer(previousState, loadExerciseFailure({ error: 'boom' }));

      expect(state).toEqual({
        ...previousState,
        exerciseLoading: false
      });
    });
  });

  describe('codeEdited', () => {
    it('creates a new pending change for the selected exercise when none exists', () => {
      const previousState = { ...initialAuthState, id: '1-1', pendingChanges: {} };

      const state = exerciseReducer(previousState, codeEdited({ code: 'new code' }));

      expect(state).toEqual({
        ...previousState,
        pendingChanges: { '1-1': { code: 'new code', saving: false } }
      });
    });

    it('only updates the code of the existing pending change for the selected exercise, leaving the saving flag and other entries untouched', () => {
      const previousState = {
        ...initialAuthState,
        id: '1-1',
        pendingChanges: {
          '1-1': { code: 'old code', saving: true },
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(previousState, codeEdited({ code: 'new code' }));

      expect(state).toEqual({
        ...previousState,
        pendingChanges: {
          '1-1': { code: 'new code', saving: true },
          '2-1': { code: 'untouched', saving: false }
        }
      });
    });
  });

  describe('savePendingChanges', () => {
    it('only toggles saving to true for the given id, leaving code and other entries untouched', () => {
      const previousState = {
        ...initialAuthState,
        pendingChanges: {
          '1-1': { code: 'some code', saving: false },
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(
        previousState,
        savePendingChanges({ id: '1-1', code: 'some code' })
      );

      expect(state).toEqual({
        ...previousState,
        pendingChanges: {
          '1-1': { code: 'some code', saving: true },
          '2-1': { code: 'untouched', saving: false }
        }
      });
    });
  });

  describe('pendingChangesSaved', () => {
    it('does nothing when there is no pending change for the given id', () => {
      const previousState = {
        ...initialAuthState,
        pendingChanges: {
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(
        previousState,
        pendingChangesSaved({ id: '1-1', code: 'some code' })
      );

      expect(state).toBe(previousState);
    });

    it('removes the pending change entirely when the saved code still matches what was last typed', () => {
      const previousState = {
        ...initialAuthState,
        pendingChanges: {
          '1-1': { code: 'some code', saving: true },
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(
        previousState,
        pendingChangesSaved({ id: '1-1', code: 'some code' })
      );

      expect(state).toEqual({
        ...previousState,
        pendingChanges: {
          '2-1': { code: 'untouched', saving: false }
        }
      });
    });

    it('just clears saving when the user has typed more since the save was dispatched, leaving the newer pending code in place', () => {
      const previousState = {
        ...initialAuthState,
        pendingChanges: {
          '1-1': { code: 'newer code', saving: true },
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(
        previousState,
        pendingChangesSaved({ id: '1-1', code: 'older code' })
      );

      expect(state).toEqual({
        ...previousState,
        pendingChanges: {
          '1-1': { code: 'newer code', saving: false },
          '2-1': { code: 'untouched', saving: false }
        }
      });
    });
  });

  describe('savePendingChangesFailure', () => {
    it('does nothing when there is no pending change for the given id', () => {
      const previousState = {
        ...initialAuthState,
        pendingChanges: {
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(
        previousState,
        savePendingChangesFailure({ id: '1-1', error: new HttpErrorResponse({ status: 400 }) })
      );

      expect(state).toBe(previousState);
    });

    it('drops the pending change entirely when the backend rejects the code as invalid (400)', () => {
      const previousState = {
        ...initialAuthState,
        pendingChanges: {
          '1-1': { code: 'some code', saving: true },
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(
        previousState,
        savePendingChangesFailure({ id: '1-1', error: new HttpErrorResponse({ status: 400 }) })
      );

      expect(state).toEqual({
        ...previousState,
        pendingChanges: {
          '2-1': { code: 'untouched', saving: false }
        }
      });
    });

    it('just clears saving on any other error, keeping the pending change so it gets retried', () => {
      const previousState = {
        ...initialAuthState,
        pendingChanges: {
          '1-1': { code: 'some code', saving: true },
          '2-1': { code: 'untouched', saving: false }
        }
      };

      const state = exerciseReducer(
        previousState,
        savePendingChangesFailure({ id: '1-1', error: new HttpErrorResponse({ status: 500 }) })
      );

      expect(state).toEqual({
        ...previousState,
        pendingChanges: {
          '1-1': { code: 'some code', saving: false },
          '2-1': { code: 'untouched', saving: false }
        }
      });
    });
  });

  describe('submitExercise', () => {
    it('sets submissionPending to true, leaving everything else unchanged', () => {
      const previousState = { ...initialAuthState, id: '1-1' };

      const state = exerciseReducer(previousState, submitExercise({ code: 'submitted code' }));

      expect(state).toEqual({
        ...previousState,
        submissionPending: true
      });
    });

    it('sets the sidebar status of the exercise being submitted to pending, leaving other exercises untouched', () => {
      const previousState = { ...initialAuthState, id: '1-1', chapters: CHAPTERS };

      const state = exerciseReducer(previousState, submitExercise({ code: 'submitted code' }));

      expect(state).toEqual({
        ...previousState,
        submissionPending: true,
        chapters: [
          {
            number: 1,
            exercises: [
              { id: '1-1', chapter: 1, number: 1, status: 'pending' },
              { id: '1-2', chapter: 1, number: 2, status: 'passed' }
            ]
          }
        ]
      });
    });
  });

  describe('exerciseSubmitted', () => {
    it('keeps the current exercise code instead of the submitted one, so a live edit made while the submission was in flight is never clobbered, and removes a pending change that matches what was submitted', () => {
      const submittedExercise: Exercise = {
        ...EXERCISE,
        code: 'submitted code',
        status: 'passed',
        tests: [{ ...EXERCISE.tests[0], status: 'passed' }]
      };

      const previousState = {
        ...initialAuthState,
        exercise: { ...EXERCISE, code: 'typed after submit' },
        pendingChanges: {
          '1-1': { code: 'submitted code', saving: false },
          '2-1': { code: 'untouched', saving: false }
        },
        submissionPending: true
      };

      const state = exerciseReducer(
        previousState,
        exerciseSubmitted({ exercise: submittedExercise })
      );

      expect(state).toEqual({
        ...previousState,
        exercise: { ...submittedExercise, code: 'typed after submit' },
        pendingChanges: {
          '2-1': { code: 'untouched', saving: false }
        },
        submissionPending: false
      });
    });

    it('leaves the pending change in place when it no longer matches what was submitted', () => {
      const submittedExercise: Exercise = { ...EXERCISE, code: 'submitted code' };

      const previousState = {
        ...initialAuthState,
        exercise: { ...EXERCISE, code: 'typed after submit' },
        pendingChanges: {
          '1-1': { code: 'even newer code', saving: false }
        },
        submissionPending: true
      };

      const state = exerciseReducer(
        previousState,
        exerciseSubmitted({ exercise: submittedExercise })
      );

      expect(state).toEqual({
        ...previousState,
        exercise: { ...submittedExercise, code: 'typed after submit' },
        submissionPending: false
      });
    });

    it('updates the sidebar status of the submitted exercise to match the result, leaving other exercises untouched', () => {
      const submittedExercise: Exercise = { ...EXERCISE, status: 'failed' };

      const previousState = {
        ...initialAuthState,
        chapters: [
          {
            number: 1,
            exercises: [
              { id: '1-1', chapter: 1, number: 1, status: 'pending' },
              { id: '1-2', chapter: 1, number: 2, status: 'passed' }
            ]
          }
        ] as Chapter[],
        submissionPending: true
      };

      const state = exerciseReducer(
        previousState,
        exerciseSubmitted({ exercise: submittedExercise })
      );

      expect(state.chapters).toEqual(
        CHAPTERS.map((chapter) => ({
          ...chapter,
          exercises: chapter.exercises.map((exercise) =>
            exercise.id === '1-1' ? { ...exercise, status: 'failed' } : exercise
          )
        }))
      );
    });
  });

  describe('submitExerciseFailed', () => {
    it('clears submissionPending, leaving everything else unchanged', () => {
      const previousState = { ...initialAuthState, submissionPending: true };

      const state = exerciseReducer(previousState, submitExerciseFailed({ error: 'boom' }));

      expect(state).toEqual({
        ...previousState,
        submissionPending: false
      });
    });

    it('sets the sidebar status of the exercise being submitted back to indeterminate, leaving other exercises untouched', () => {
      const previousState = {
        ...initialAuthState,
        id: '1-1',
        chapters: [
          {
            number: 1,
            exercises: [
              { id: '1-1', chapter: 1, number: 1, status: 'pending' },
              { id: '1-2', chapter: 1, number: 2, status: 'passed' }
            ]
          }
        ] as Chapter[],
        submissionPending: true
      };

      const state = exerciseReducer(previousState, submitExerciseFailed({ error: 'boom' }));

      expect(state).toEqual({
        ...previousState,
        submissionPending: false,
        chapters: CHAPTERS
      });
    });
  });
});
