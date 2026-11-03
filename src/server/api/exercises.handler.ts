import { RequestHandler } from 'express';
import { CHAPTERS } from '../../exercises';
import { Chapter, ExercisesResponseBody } from '../../shared/models';

function toChapters(): Chapter[] {
  return CHAPTERS.map((chapter) => ({
    number: chapter.number,
    exercises: chapter.exercises.map(({ id, chapter: chapterNumber, number, suffix }) => ({
      id,
      chapter: chapterNumber,
      number,
      suffix,
      status: 'passed'
    }))
  }));
}

export const getExercisesPublicHandler: RequestHandler<
  Record<string, never>,
  ExercisesResponseBody
> = async (req, res) => {
  res.json({ chapters: toChapters() });
};

export const getExercisesPrivateHandler: RequestHandler<
  Record<string, never>,
  ExercisesResponseBody
> = async (req, res) => {
  res.json({ chapters: toChapters() });
};
