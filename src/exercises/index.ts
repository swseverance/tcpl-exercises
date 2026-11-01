import { Exercise } from '../models/exercise';
import { exercise1_1 } from './1/1/exercise';
import { exercise1_8 } from './1/8/exercise';
import { exercise33_1 } from './33/1/exercise';
import { exercise33_2 } from './33/2/exercise';
import { exercise33_3 } from './33/3/exercise';

export type Chapter = {
  number: number;
  exercises: Exercise[];
};

export const CHAPTERS: Chapter[] = [
  { number: 1, exercises: [exercise1_1, exercise1_8] },
  { number: 33, exercises: [exercise33_1, exercise33_2, exercise33_3] }
];

export const EXERCISES: Exercise[] = CHAPTERS.flatMap((chapter) => chapter.exercises);

export const EXERCISES_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((exercise) => [exercise.id, exercise])
);
