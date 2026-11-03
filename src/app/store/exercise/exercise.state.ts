import { ExerciseFinal } from '../../../models/exercise';

export type ExerciseState = {
  id: string;

  pendingChanges: Record<
    string,
    {
      code: string;
      saving: boolean;
    }
  >;

  exerciseLoading: boolean;

  exercise: ExerciseFinal;
};

export const initialAuthState: ExerciseState = {
  id: '',

  pendingChanges: {},

  exerciseLoading: false,

  exercise: {
    id: '',
    chapter: 0,
    number: 0,
    description: '',
    code: '',
    solution: '',
    tests: [],
    state: 'indeterminate'
  }
};
