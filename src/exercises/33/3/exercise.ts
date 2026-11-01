import { Exercise } from '../../../models/exercise';
import solution from './main.c' with { type: 'text' };

export const exercise33_3: Exercise = {
  id: '33-3',
  chapter: 33,
  number: 3,
  description: 'Dummy exercise: print a fixed greeting with no input.',
  solution,
  tests: [{ expectedStdout: 'Hello, dummy!\n' }]
};
