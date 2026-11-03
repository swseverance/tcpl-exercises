import { RequestHandler } from 'express';
import { EXERCISES_BY_ID } from '../../exercises';
import { ExerciseFinal } from '../../models/exercise';

export const getExercisePublicHandler: RequestHandler<{ id: string }> = async (req, res) => {
  const exerciseId = req.params.id;

  const exercise = EXERCISES_BY_ID[exerciseId];

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  const { id, chapter, number, suffix, description, solution, tests } = exercise;

  res.json({
    id,
    chapter,
    number,
    suffix,
    description,
    code: `#include <stdio.h>\n\nint main() {\n\n}\n`,
    solution,
    tests: tests.map(({ id, stdin, expectedStdout }) => ({
      id,
      stdin: stdin ?? '',
      expectedStdout,
      actualStdout: '',
      status: 'indeterminate'
    })),
    state: 'indeterminate'
  } satisfies ExerciseFinal);
};

export const getExercisePrivateHandler: RequestHandler<{ id: string }> = async (req, res) => {
  const exerciseId = req.params.id;

  const exercise = EXERCISES_BY_ID[exerciseId];

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  const { id, chapter, number, suffix, description, solution, tests } = exercise;

  res.json({
    id,
    chapter,
    number,
    suffix,
    description,
    code: 'there will be code here',
    solution,
    tests: tests.map(({ id, stdin, expectedStdout }) => ({
      id,
      stdin: stdin ?? '',
      expectedStdout,
      actualStdout: '',
      status: 'indeterminate'
    })),
    state: 'indeterminate'
  } satisfies ExerciseFinal);
};
