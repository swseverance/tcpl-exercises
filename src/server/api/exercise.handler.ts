import { RequestHandler } from 'express';
import {
  Exercise,
  ExerciseFinal,
  ExerciseFinalStatus,
  ExerciseTestCaseFinal,
  STARTER_CODE
} from '../../models/exercise';
import { ExerciseRecordTestResult } from '../../models/exercise-record';
import { getExerciseRecord, saveExerciseRecordCode } from '../firestore/exercise-records';

type SaveExerciseCodeRequestBody = {
  code: string;
};

function toExerciseFinal(
  exercise: Exercise,
  code: string,
  tests: Record<string, ExerciseRecordTestResult>
): ExerciseFinal {
  const { id, chapter, number, suffix, description, solution } = exercise;

  const finalTests: ExerciseTestCaseFinal[] = exercise.tests.map(
    ({ id: testId, stdin, expectedStdout }): ExerciseTestCaseFinal => {
      const result: ExerciseRecordTestResult | undefined = tests[testId];

      if (!result) {
        return {
          id: testId,
          stdin: stdin ?? '',
          expectedStdout,
          actualStdout: '',
          status: 'indeterminate'
        };
      }

      return {
        id: testId,
        stdin: stdin ?? '',
        expectedStdout,
        actualStdout: result.actualStdout,
        status: result.status
      };
    }
  );

  const state: ExerciseFinalStatus = finalTests.some((test) => test.status === 'indeterminate')
    ? 'indeterminate'
    : finalTests.some((test) => test.status === 'failed')
      ? 'failed'
      : 'passed';

  return {
    id,
    chapter,
    number,
    suffix,
    description,
    code,
    solution,
    tests: finalTests,
    state
  };
}

export const getExercisePublicHandler: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(toExerciseFinal(req.exercise, `#include <stdio.h>\n\nint main() {\n\n}\n`, {}));
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
    res.json(toExerciseFinal(req.exercise, record.code, record.tests));
  } catch (err) {
    console.error('[exercise] save code failed:', err);
    res.status(500).json({ message: 'Failed to save code' });
  }
};

export const getExercisePrivateHandler: RequestHandler<{ id: string }> = async (req, res) => {
  const record = await getExerciseRecord(req.uid!, req.params.id);
  res.json(toExerciseFinal(req.exercise, record?.code ?? STARTER_CODE, record?.tests ?? {}));
};
