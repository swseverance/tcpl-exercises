import { ExerciseFinal } from '../../../models/exercise';

export type ExerciseState = {
  id: string;

  exerciseLoading: boolean;

  exercise: ExerciseFinal;
};

export const initialAuthState: ExerciseState = {
  id: '',

  exerciseLoading: false,

  exercise: {
    id: '',
    chapter: 0,
    number: 0,
    description: '',
    solution: '',
    tests: [],
    state: 'indeterminate'
  }
};
