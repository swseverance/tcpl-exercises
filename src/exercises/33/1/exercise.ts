import { Exercise } from '../../../models/exercise';
import solution from './main.c' with { type: 'text' };

export const exercise33_1: Exercise = {
  id: '33-1',
  number: 1,
  description: 'Dummy exercise: read an integer and print double its value.',
  solution,
  tests: [
    { stdin: '5', expectedStdout: '10\n' },
    { stdin: '0', expectedStdout: '0\n' },
    { stdin: '-3', expectedStdout: '-6\n' }
  ]
};
