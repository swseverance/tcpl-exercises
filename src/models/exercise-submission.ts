import { RunCResponse } from './run-c';

export type ExerciseSubmission = {
  id: string;
  exerciseId: string;
  code: string;
  result: RunCResponse;
  created: string;
};
