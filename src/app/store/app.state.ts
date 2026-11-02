import { ExerciseDraft } from '../../models/exercise-draft';
import { ExerciseSubmission } from '../../models/exercise-submission';
import { ThemeName } from '../services/theme';

export type SubmissionStatus = 'idle' | 'submitting' | 'error';

export type ExerciseSubmissionsState = {
  exerciseId: string | null;
  current: ExerciseSubmission | null;
  status: SubmissionStatus;
  error: string | null;
};

export type AppState = {
  theme: ThemeName | null;

  id: string | null;

  pendingChanges: Record<string, ExerciseDraft>;

  draft: Record<string, ExerciseDraft>;

  submissions: ExerciseSubmissionsState;
};

export const initialAppState: AppState = {
  theme: null,

  id: null,

  pendingChanges: {},

  draft: {},

  submissions: { exerciseId: null, current: null, status: 'idle', error: null }
};
