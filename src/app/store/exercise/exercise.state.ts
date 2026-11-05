import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Chapter, Exercise } from '../../../shared/models';

export type ExerciseEntity = Exercise & {
  pendingChanges: string;

  loading: boolean;

  submitting: boolean;
};

export const exerciseEntityAdapter = createEntityAdapter<ExerciseEntity>();

export const DEFAULT_EXERCISE: Exercise = {
  id: '',
  chapter: 0,
  number: 0,
  description: '',
  code: '',
  solution: '',
  tests: [],
  status: 'indeterminate',
  compilationError: ''
};

export interface ExerciseState extends EntityState<ExerciseEntity> {
  id: string;

  chapters: Chapter[];

  chaptersLoading: boolean;
}

export const initialExerciseState: ExerciseState = exerciseEntityAdapter.getInitialState({
  id: '',
  chapters: [],
  chaptersLoading: false
});
