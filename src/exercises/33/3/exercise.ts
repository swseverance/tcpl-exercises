import { ExerciseSource } from '../../../models/exercise';
import solution from './main.c' with { type: 'text' };

export const exercise33_3: ExerciseSource = {
  id: '33-3',
  chapter: 33,
  number: 3,
  description: 'Dummy exercise: print a fixed greeting with no input.',
  solution,
  tests: [{ id: '56472e15', expectedStdout: 'Hello, dummy!\n' }]
};
