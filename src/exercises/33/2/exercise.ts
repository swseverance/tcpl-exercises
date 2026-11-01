import { Exercise } from '../../../models/exercise';
import solution from './main.c' with { type: 'text' };

export const exercise33_2: Exercise = {
  id: '33-2',
  number: 2,
  description: 'Dummy exercise: read two integers and print their sum.',
  solution,
  tests: [
    { stdin: '1 2', expectedStdout: '3\n' },
    { stdin: '0 0', expectedStdout: '0\n' },
    { stdin: '-5 5', expectedStdout: '0\n' }
  ]
};
