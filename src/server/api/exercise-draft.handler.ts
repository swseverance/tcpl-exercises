import { RequestHandler } from 'express';
import { EXERCISES_BY_ID } from '../../exercises';
import { SaveExerciseDraftsResult } from '../../models/exercise-draft';
import {
  getExerciseDraft,
  SaveExerciseDraftArgs,
  saveExerciseDrafts
} from '../firestore/exercise-drafts';

const MAX_CODE_LENGTH = 20_000;

type SaveExerciseDraftsRequestBody = {
  drafts: SaveExerciseDraftArgs[];
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

function validateExerciseDraft(
  entry: SaveExerciseDraftArgs
): { valid: true } | { valid: false; message: string } {
  const { exerciseId, code } = entry;

  if (typeof exerciseId !== 'string' || !EXERCISES_BY_ID[exerciseId]) {
    return { valid: false, message: 'Exercise not found' };
  }

  if (typeof code !== 'string') {
    return { valid: false, message: 'code must be a string' };
  }

  if (code.length > MAX_CODE_LENGTH) {
    return { valid: false, message: `code must be at most ${MAX_CODE_LENGTH} characters` };
  }

  return { valid: true };
}

export const saveExerciseDraftsHandler: RequestHandler = async (req, res) => {
  const { drafts } = req.body as SaveExerciseDraftsRequestBody;

  if (!Array.isArray(drafts)) {
    res.status(400).json({ message: 'drafts is required' });
    return;
  }

  const valid: SaveExerciseDraftArgs[] = [];
  const invalid: SaveExerciseDraftsResult['invalid'] = [];

  drafts.forEach((entry) => {
    const result = validateExerciseDraft(entry);

    if (result.valid) {
      valid.push(entry);
    } else {
      invalid.push({ id: entry.exerciseId, message: result.message });
    }
  });

  let saved: SaveExerciseDraftsResult['saved'] = [];
  const failed: SaveExerciseDraftsResult['failed'] = [];

  if (valid.length > 0) {
    try {
      saved = await saveExerciseDrafts(req.uid, valid);
    } catch (err) {
      console.error('[exercise-draft] save failed:', err);
      valid.forEach(({ exerciseId }) =>
        failed.push({ id: exerciseId, message: 'Failed to save draft' })
      );
    }
  }

  const response: SaveExerciseDraftsResult = { saved, failed, invalid };
  res.json(response);
};
