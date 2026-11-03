export type ExerciseTestCaseStatus = 'passed' | 'failed' | 'indeterminate';

export type ExerciseTestCase = {
  id: string;
  stdin: string;
  expectedStdout: string;
  actualStdout: string;
  status: ExerciseTestCaseStatus;
};

export type ExerciseStatus = 'passed' | 'failed' | 'indeterminate';

export type Exercise = {
  id: string;
  chapter: number;
  number: number;
  suffix?: string;
  description: string;
  code: string;
  solution: string;
  tests: ExerciseTestCase[];
  state: ExerciseStatus;
};
