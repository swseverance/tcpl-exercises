import { ExerciseSubmission } from '../../models/exercise-submission';

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export type AuthState = {
  status: 'loading' | 'resolved';
  user: AuthUser | null;
};

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
  auth: AuthState;
  draft: ExerciseDraftState;
  submissions: ExerciseSubmissionsState;
};

export const initialAppState: AppState = {
  auth: { status: 'loading', user: null },
  draft: { exerciseId: null, code: '', status: 'idle', error: null },
  submissions: { exerciseId: null, current: null, status: 'idle', error: null }
};
