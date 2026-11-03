import { RequestHandler } from 'express';
import { Exercise, ExerciseFinal } from '../../models/exercise';
import { saveExerciseRecordCode } from '../firestore/exercise-records';

type SaveExerciseCodeRequestBody = {
  code: string;
};

function toExerciseFinal(exercise: Exercise, code: string): ExerciseFinal {
  const { id, chapter, number, suffix, description, solution, tests } = exercise;

  return {
    id,
    chapter,
    number,
    suffix,
    description,
    code,
    solution,
    tests: tests.map(({ id, stdin, expectedStdout }) => ({
      id,
      stdin: stdin ?? '',
      expectedStdout,
      actualStdout: '',
      status: 'indeterminate'
    })),
    state: 'indeterminate'
  };
}

export const getExercisePublicHandler: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(toExerciseFinal(req.exercise, `#include <stdio.h>\n\nint main() {\n\n}\n`));
};

const MAX_CODE_LENGTH = 20_000;

export const saveExerciseCodeHandler: RequestHandler<
  { id: string },
  unknown,
  SaveExerciseCodeRequestBody
> = async (req, res) => {
  const code = req.body.code === null ? '' : req.body.code;

  if (typeof code !== 'string') {
    res.status(400).json({ message: 'code is required' });
    return;
  }

  if (code.length > MAX_CODE_LENGTH) {
    res.status(400).json({ message: `code must be at most ${MAX_CODE_LENGTH} characters` });
    return;
  }

  try {
    const record = await saveExerciseRecordCode(req.uid!, req.params.id, code);
    res.json(toExerciseFinal(req.exercise, record.code));
  } catch (err) {
    console.error('[exercise] save code failed:', err);
    res.status(500).json({ message: 'Failed to save code' });
  }
};

export const getExercisePrivateHandler: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(toExerciseFinal(req.exercise, 'there will be code here'));
};
