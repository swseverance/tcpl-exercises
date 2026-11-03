import { RequestHandler } from 'express';
import { ExerciseSource } from '../../models/exercise';
import { ExerciseRecordTestResult } from '../../models/exercise-record';
import { Exercise, ExerciseStatus, ExerciseTestCase } from '../../shared/models';
import {
  getExerciseRecord,
  saveExerciseRecordCode,
  saveExerciseRecordSubmission
} from '../firestore/exercise-records';
import { gradeSubmission } from '../sandbox/run-c';

const STARTER_CODE = `#include <stdio.h>\n\nint main() {\n  return 0;\n}\n`;

type ExerciseCodeRequestBody = {
  code: string;
};

function toExercise(
  exercise: ExerciseSource,
  code: string,
  tests: Record<string, ExerciseRecordTestResult>
): Exercise {
  const { id, chapter, number, suffix, description, solution } = exercise;

  const finalTests: ExerciseTestCase[] = exercise.tests.map(
    ({ id: testId, stdin, expectedStdout }): ExerciseTestCase => {
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

  const state: ExerciseStatus = finalTests.some((test) => test.status === 'indeterminate')
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
  res.json(toExercise(req.exercise, `#include <stdio.h>\n\nint main() {\n\n}\n`, {}));
};

const MAX_CODE_LENGTH = 20_000;

export const saveExerciseCodeHandler: RequestHandler<
  { id: string },
  unknown,
  ExerciseCodeRequestBody
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
    res.json(toExercise(req.exercise, record.code, record.tests));
  } catch (err) {
    console.error('[exercise] save code failed:', err);
    res.status(500).json({ message: 'Failed to save code' });
  }
};

export const getExercisePrivateHandler: RequestHandler<{ id: string }> = async (req, res) => {
  const record = await getExerciseRecord(req.uid!, req.params.id);
  res.json(toExercise(req.exercise, record?.code ?? STARTER_CODE, record?.tests ?? {}));
};

export const submitExerciseHandler: RequestHandler<
  { id: string },
  unknown,
  ExerciseCodeRequestBody
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
    const { compile, results } = await gradeSubmission(code, req.exercise.tests);
    const compileFailed = compile.timedOut || compile.exitCode !== 0;

    const tests: Record<string, ExerciseRecordTestResult> = compileFailed
      ? Object.fromEntries(
          req.exercise.tests.map((test) => [test.id, { status: 'failed', actualStdout: '' }])
        )
      : Object.fromEntries(
          results.map((result) => [
            result.id,
            { status: result.passed ? 'passed' : 'failed', actualStdout: result.stdout }
          ])
        );

    const record = await saveExerciseRecordSubmission(req.uid!, req.params.id, code, tests);
    res.json(toExercise(req.exercise, record.code, record.tests));
  } catch (err) {
    console.error('[exercise] submit failed:', err);
    res.status(500).json({ message: 'Failed to submit exercise' });
  }
};
