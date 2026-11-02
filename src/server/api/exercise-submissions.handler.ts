import { RequestHandler } from 'express';
import { EXERCISES_BY_ID } from '../../exercises';
import {
  createExerciseSubmission,
  listExerciseSubmissions
} from '../firestore/exercise-submissions';
import { runCInSandbox } from '../sandbox/run-c';

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

  if (!EXERCISES_BY_ID[exerciseId]) {
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
    const result = await runCInSandbox(code);
    const submission = await createExerciseSubmission(req.uid, { exerciseId, code, result });
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
