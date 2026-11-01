export type ExerciseTestCase = {
  stdin?: string;
  expectedStdout: string;
};

export type Exercise = {
  id: string;
  description: string;
  solution: string;
  tests: ExerciseTestCase[];
};

export function hashExerciseTests(tests: ExerciseTestCase[]): string {
  const json = JSON.stringify(tests);

  let hash = 5381;
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 33) ^ json.charCodeAt(i);
  }

  return (hash >>> 0).toString(16);
}
