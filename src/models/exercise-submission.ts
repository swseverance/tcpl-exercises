import { RunCResponse } from './run-c';

export type ExerciseTestResult = {
  id: string;
  passed: boolean;
  stdout: string;
};

export type ExerciseSubmission = {
  id: string;
  exerciseId: string;
  code: string;
  compile: RunCResponse;
  results: ExerciseTestResult[];
  overallPassed: boolean;
  testsHash: string;
  created: string;
};
