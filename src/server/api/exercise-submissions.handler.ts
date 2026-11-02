import { RequestHandler } from 'express';
import { EXERCISES_BY_ID } from '../../exercises';
import { hashExerciseTests } from '../../models/exercise';
import {
  ExerciseTestCaseResult,
  ExerciseTestResultsResponse
} from '../../models/exercise-test-results';
import {
  createExerciseSubmission,
  getLatestExerciseSubmission,
  listExerciseSubmissions
} from '../firestore/exercise-submissions';
import { gradeSubmission } from '../sandbox/run-c';

const MAX_CODE_LENGTH = 20_000;

type SubmitExerciseRequestBody = {
  code: unknown;
};

export const submitExerciseHandler: RequestHandler<
  { id: string },
  unknown,
  SubmitExerciseRequestBody
> = async (req, res) => {
  const exerciseId = req.params.id;
  const exercise = EXERCISES_BY_ID[exerciseId];

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  const { code } = req.body;

  if (typeof code !== 'string' || code.length === 0) {
    res.status(400).json({ message: 'code is required' });
    return;
  }

  if (code.length > MAX_CODE_LENGTH) {
    res.status(400).json({ message: `code must be at most ${MAX_CODE_LENGTH} characters` });
    return;
  }

  try {
    const { compile, results } = await gradeSubmission(code, exercise.tests);
    const overallPassed = results.length > 0 && results.every((result) => result.passed);
    const testsHash = hashExerciseTests(exercise.tests);

    const submission = await createExerciseSubmission(req.uid, {
      exerciseId,
      code,
      compile,
      results,
      overallPassed,
      testsHash
    });
    res.json(submission);
  } catch (err) {
    console.error('[exercise-submissions] submit failed:', err);
    res.status(500).json({ message: 'Failed to submit solution' });
  }
};

export const listExerciseSubmissionsHandler: RequestHandler<{ id: string }> = async (req, res) => {
  const exerciseId = req.params.id;

  if (!EXERCISES_BY_ID[exerciseId]) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  try {
    const submissions = await listExerciseSubmissions(req.uid, exerciseId);
    res.json(submissions);
  } catch (err) {
    console.error('[exercise-submissions] list failed:', err);
    res.status(500).json({ message: 'Failed to load submissions' });
  }
};

export const getExerciseTestResultsHandler: RequestHandler<{ id: string }> = async (req, res) => {
  const exerciseId = req.params.id;
  const exercise = EXERCISES_BY_ID[exerciseId];

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  try {
    const submission = await getLatestExerciseSubmission(req.uid, exerciseId);
    const currentHash = hashExerciseTests(exercise.tests);
    const stale = submission !== null && submission.testsHash !== currentHash;

    const tests: ExerciseTestCaseResult[] = exercise.tests.map((test) => {
      if (!submission || stale) {
        return { ...test, passed: null, stdout: null };
      }

      if (submission.results.length === 0) {
        return { ...test, passed: false, stdout: null };
      }

      const result = submission.results.find((r) => r.id === test.id);
      return { ...test, passed: result?.passed ?? null, stdout: result?.stdout ?? null };
    });

    const response: ExerciseTestResultsResponse = {
      tests,
      hasSubmission: submission !== null,
      stale
    };

    res.json(response);
  } catch (err) {
    console.error('[exercise-submissions] test-results failed:', err);
    res.status(500).json({ message: 'Failed to load test results' });
  }
};
