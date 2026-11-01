import { Exercise } from '../../../models/exercise';
import solution from './main.c' with { type: 'text' };

export const exercise1_8: Exercise = {
  id: '1-8',
  chapter: 1,
  number: 8,
  description: 'Write a program to count blanks, tabs, and newlines.',
  solution,
  tests: [
    {
      stdin: 'abc',
      expectedStdout: '0 0 0\n'
    },
    {
      stdin: 'a b\tc\n',
      expectedStdout: '1 1 1\n'
    },
    {
      stdin: '\n\n\n',
      expectedStdout: '0 0 3\n'
    },
    {
      stdin: '',
      expectedStdout: '0 0 0\n'
    },
    {
      stdin: '   ',
      expectedStdout: '3 0 0\n'
    },
    {
      stdin: '\t\t',
      expectedStdout: '0 2 0\n'
    },
    {
      stdin: '  a\t\tb\n\nc  \n',
      expectedStdout: '4 2 3\n'
    }
  ]
};
