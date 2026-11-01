import { Chapter, Exercise } from '../models/exercise';
import { exercise1_1 } from './1/1/exercise';
import { exercise1_8 } from './1/8/exercise';
import { exercise33_1 } from './33/1/exercise';
import { exercise33_2 } from './33/2/exercise';
import { exercise33_3 } from './33/3/exercise';

export const EXERCISES: Exercise[] = [
  exercise1_1,
  exercise1_8,
  exercise33_1,
  exercise33_2,
  exercise33_3
];

export const CHAPTERS: Chapter[] = Array.from(
  EXERCISES.reduce((chapters, exercise) => {
    const exercises = chapters.get(exercise.chapter) ?? [];
    exercises.push(exercise);
    chapters.set(exercise.chapter, exercises);
    return chapters;
  }, new Map<number, Exercise[]>()),
  ([number, exercises]) => ({ number, exercises })
).sort((a, b) => a.number - b.number);

export const EXERCISES_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((exercise) => [exercise.id, exercise])
);
