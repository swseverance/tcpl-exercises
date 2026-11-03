import { HttpErrorResponse } from '@angular/common/http';
import { ExerciseFinal } from '../../../models/exercise';
import {
  codeEdited,
  exerciseLoaded,
  loadExerciseFailure,
  pendingChangesSaved,
  savePendingChanges,
  savePendingChangesFailure,
  selectExercise
} from './exercise.actions';
import { exerciseReducer } from './exercise.reducer';
import { initialAuthState } from './exercise.state';

const EXERCISE_FINAL: ExerciseFinal = {
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
  state: 'indeterminate'
};

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

      const state = exerciseReducer(previousState, exerciseLoaded({ exercise: EXERCISE_FINAL }));

      expect(state).toEqual({
        ...previousState,
        exercise: EXERCISE_FINAL,
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
});
