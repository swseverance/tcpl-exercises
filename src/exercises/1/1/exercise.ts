import { ExerciseSource } from '../../../models/exercise';
import solution from './main.c' with { type: 'text' };

export const exercise1_1: ExerciseSource = {
  id: '1-1',
  chapter: 1,
  number: 1,
  description:
    'Run the "hello, world" program on your system. Experiment with leaving out parts of the program, to see what error messages you get.',
  solution,
  tests: [{ id: '3ee816ef', expectedStdout: 'hello, world\n' }]
};
