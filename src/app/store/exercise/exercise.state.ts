import { Chapter, Exercise } from '../../../shared/models';

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

  exercise: Exercise;

  submissionPending: boolean;

  chapters: Chapter[];

  exercisesLoading: boolean;
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
    status: 'indeterminate'
  },

  submissionPending: false,

  chapters: [],

  exercisesLoading: false
};
