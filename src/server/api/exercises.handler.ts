import { RequestHandler } from 'express';
import { ExerciseSource } from '../../models/exercise';
import { ExerciseRecordTestResult } from '../../models/exercise-record';
import { Chapter, ExerciseStatus, ExercisesResponseBody } from '../../shared/models';
import { CHAPTERS } from '../exercises';
import { computeExerciseStatus } from '../exercises/status';
import { getExerciseRecordTestsByExerciseId } from '../firestore/exercise-records';

function toChapters(getStatus: (exercise: ExerciseSource) => ExerciseStatus): Chapter[] {
  return CHAPTERS.map((chapter) => ({
    number: chapter.number,
    exercises: chapter.exercises.map((exercise) => ({
      id: exercise.id,
      chapter: exercise.chapter,
      number: exercise.number,
      suffix: exercise.suffix,
      status: getStatus(exercise)
    }))
  }));
}

export const getExercisesPublicHandler: RequestHandler<
  Record<string, never>,
  ExercisesResponseBody
> = async (req, res) => {
  res.json({
    chapters: toChapters((exercise) => computeExerciseStatus(exercise.tests, {}))
  });
};

export const getExercisesPrivateHandler: RequestHandler<
  Record<string, never>,
  ExercisesResponseBody
> = async (req, res) => {
  const testsByExerciseId: Record<
    string,
    Record<string, ExerciseRecordTestResult>
  > = await getExerciseRecordTestsByExerciseId(req.uid);

  res.json({
    chapters: toChapters((exercise) =>
      computeExerciseStatus(exercise.tests, testsByExerciseId[exercise.id] ?? {})
    )
  });
};
