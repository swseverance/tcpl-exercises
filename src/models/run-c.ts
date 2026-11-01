export type RunCRequest = {
  code: string;
};

export type RunCResponse = {
  stage: 'compile' | 'run';
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
};
