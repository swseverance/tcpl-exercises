import { RequestHandler } from 'express';
import { EXERCISES_BY_ID } from '../../exercises';
import { getExerciseDraft, saveExerciseDraft } from '../firestore/exercise-drafts';

const MAX_CODE_LENGTH = 20_000;

type SaveExerciseDraftRequestBody = {
  code: unknown;
};

export const getExerciseDraftHandler: RequestHandler<{ id: string }> = async (req, res) => {
  const exerciseId = req.params.id;

  if (!EXERCISES_BY_ID[exerciseId]) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  try {
    const draft = await getExerciseDraft(req.uid, exerciseId);
    res.json(draft);
  } catch (err) {
    console.error('[exercise-draft] get failed:', err);
    res.status(500).json({ message: 'Failed to load draft' });
  }
};

export const saveExerciseDraftHandler: RequestHandler<
  { id: string },
  unknown,
  SaveExerciseDraftRequestBody
> = async (req, res) => {
  const exerciseId = req.params.id;

  if (!EXERCISES_BY_ID[exerciseId]) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  const { code } = req.body;

  if (typeof code !== 'string') {
    res.status(400).json({ message: 'code is required' });
    return;
  }

  if (code.length > MAX_CODE_LENGTH) {
    res.status(400).json({ message: `code must be at most ${MAX_CODE_LENGTH} characters` });
    return;
  }

  try {
    const draft = await saveExerciseDraft(req.uid, { exerciseId, code });
    res.json(draft);
  } catch (err) {
    console.error('[exercise-draft] save failed:', err);
    res.status(500).json({ message: 'Failed to save draft' });
  }
};
