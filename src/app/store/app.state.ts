import { ExerciseSubmission } from '../../models/exercise-submission';
import { ThemeName } from '../services/theme';

export type DraftStatus = 'idle' | 'loading' | 'dirty' | 'saving' | 'saved' | 'error';

export type ExerciseDraftState = {
  exerciseId: string | null;
  code: string;
  status: DraftStatus;
  error: string | null;
};

export type SubmissionStatus = 'idle' | 'submitting' | 'error';

export type ExerciseSubmissionsState = {
  exerciseId: string | null;
  current: ExerciseSubmission | null;
  status: SubmissionStatus;
  error: string | null;
};

export type AppState = {
  theme: ThemeName | null;
  draft: ExerciseDraftState;
  submissions: ExerciseSubmissionsState;
};

export const initialAppState: AppState = {
  theme: null,
  draft: { exerciseId: null, code: '', status: 'idle', error: null },
  submissions: { exerciseId: null, current: null, status: 'idle', error: null }
};
