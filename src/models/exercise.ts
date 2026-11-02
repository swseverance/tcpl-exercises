export type ExerciseTestCase = {
  id: string;
  stdin?: string;
  expectedStdout: string;
};

export type Exercise = {
  id: string;
  chapter: number;
  number: number;
  suffix?: string;
  description: string;
  solution: string;
  tests: ExerciseTestCase[];
};

export type Chapter = {
  number: number;
  exercises: Exercise[];
};

export const STARTER_CODE = `#include <stdio.h>

int main() {

    return 0;
}
`;

export function hashExerciseTests(tests: ExerciseTestCase[]): string {
  const json = JSON.stringify(tests);

  let hash = 5381;
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 33) ^ json.charCodeAt(i);
  }

  return (hash >>> 0).toString(16);
}
