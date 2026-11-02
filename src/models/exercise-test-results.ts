import { ExerciseTestCase } from './exercise';

export type ExerciseTestCaseResult = ExerciseTestCase & {
  passed: boolean | null;
  stdout: string | null;
};

export type ExerciseTestResultsResponse = {
  tests: ExerciseTestCaseResult[];
  hasSubmission: boolean;
  stale: boolean;
};
