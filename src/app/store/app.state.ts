import { ExerciseSubmission } from '../../models/exercise-submission';
import { THEME_STORAGE_KEY, ThemeName } from '../services/theme';

// Read directly off localStorage so the store's initial state matches the theme the
// inline script in index.html already persisted and applied before Angular bootstraps.
const initialTheme: ThemeName =
  typeof localStorage !== 'undefined' && localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
    ? 'dark'
    : 'light';

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
  theme: ThemeName;
  draft: ExerciseDraftState;
  submissions: ExerciseSubmissionsState;
};

export const initialAppState: AppState = {
  theme: initialTheme,
  draft: { exerciseId: null, code: '', status: 'idle', error: null },
  submissions: { exerciseId: null, current: null, status: 'idle', error: null }
};
