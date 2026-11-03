import { ExerciseDraft } from '../../models/exercise-draft';
import { ExerciseSubmission } from '../../models/exercise-submission';

export type AppState = {
  id: string | null;

  pendingChanges: Record<string, ExerciseDraft>;

  draft: Record<string, ExerciseDraft>;

  submissions: ExerciseSubmission[];

  testResults: Record<string, TestResult>;
};

export type TestResult = {
  passed: boolean | null;
  stdout: string | null;
};

export const initialAppState: AppState = {
  id: null,

  pendingChanges: {},

  draft: {},

  submissions: [],

  testResults: {}
};
